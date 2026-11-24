from app.core.utils import ahora
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

# RN-02: mapa de transiciones válidas 
TRANSICIONES: dict[str, set[str]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


# Excepciones de dominio (el Router las traduce a HTTP)
class PedidoNoEncontrado(Exception):  # 404
    pass


class PedidoAjeno(Exception):  # 403
    pass


class ProductoRepetido(Exception):  # 400
    pass


class ProductoNoDisponible(Exception):  # 400
    pass


class StockInsuficiente(Exception):  # 400
    pass


class TransicionInvalida(Exception):  # 400
    pass


class PedidoService:

    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    # auxiliares

    def _get(self, uow: PedidoUnitOfWork, pedido_id: int) -> Pedido:
        pedido = uow.pedidos.get_by_id(pedido_id)
        if pedido is None:
            raise PedidoNoEncontrado()
        return pedido

    def _restituir_stock(self, uow: PedidoUnitOfWork, pedido: Pedido) -> None:
        # RN-03: devuelve al stock la cantidad de cada línea
        for item in pedido.items:
            producto = uow.productos.get_by_id(item.producto_id)
            if producto is not None:
                producto.stock += item.cantidad
                uow.productos.update(producto)

    # casos de uso

    def crear(self, usuario: UserPublic, data: PedidoCreate) -> PedidoRead:
        """RN-01: todo ocurre en una transacción; si algo falla, el UoW hace rollback de todo."""
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido("Un producto no puede repetirse en el pedido")

            pedido = uow.pedidos.add(Pedido(
                usuario_id=usuario.id,
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                estado="PENDIENTE",
                total=0,
            ))

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(f"Producto {item.producto_id} no encontrado")
                if not producto.disponible:
                    raise ProductoNoDisponible(f"El producto '{producto.nombre}' no está disponible")
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(
                        f"Stock insuficiente de '{producto.nombre}' (disponible: {producto.stock})"
                    )

                producto.stock -= item.cantidad
                uow.productos.update(producto)

                subtotal = round(producto.precio_base * item.cantidad, 2)
                uow.detalles.add(DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,  # copia (RN-05)
                    precio_unitario=producto.precio_base,  # copia (RN-05)
                    subtotal=subtotal,
                ))
                total += subtotal

            pedido.total = round(total, 2)
            uow.pedidos.update(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(self, usuario: UserPublic, estado: str | None, skip: int, limit: int) -> PedidosPaginados:
        # RN-04: el admin ve todos; el cliente, solo los suyos
        with self.uow as uow:
            usuario_id = None if usuario.role == "admin" else usuario.id
            total, pedidos = uow.pedidos.list_by_usuario(usuario_id, estado, skip, limit)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(p) for p in pedidos])

    def obtener(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._get(uow, pedido_id)
            if usuario.role != "admin" and pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, nuevo_estado: str) -> PedidoRead:
        """Solo admin: avanza o cancela según la máquina de estados (RN-02 y RN-03)."""
        with self.uow as uow:
            pedido = self._get(uow, pedido_id)
            if nuevo_estado not in TRANSICIONES[pedido.estado]:
                raise TransicionInvalida(f"No se puede pasar de {pedido.estado} a {nuevo_estado}")

            if nuevo_estado == "CANCELADO":
                self._restituir_stock(uow, pedido)

            pedido.estado = nuevo_estado
            pedido.updated_at = ahora()
            uow.pedidos.update(pedido)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        """El dueño cancela su pedido, solo desde PENDIENTE (RN-03 y RN-04)"""
        with self.uow as uow:
            pedido = self._get(uow, pedido_id)
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida("Solo se puede cancelar un pedido en estado PENDIENTE")

            self._restituir_stock(uow, pedido)
            pedido.estado = "CANCELADO"
            pedido.updated_at = ahora()
            uow.pedidos.update(pedido)
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            inicio_hoy = ahora().replace(hour=0, minute=0, second=0, microsecond=0)
            return ResumenPedidos(
                pendientes=uow.pedidos.count_by_estado("PENDIENTE"),
                en_preparacion=uow.pedidos.count_by_estado("EN_PREPARACION"),
                entregados=uow.pedidos.count_by_estado("ENTREGADO"),
                cancelados=uow.pedidos.count_by_estado("CANCELADO"),
                pedidos_hoy=uow.pedidos.count_desde(inicio_hoy),
                ingresos_entregados=uow.pedidos.sum_total_by_estado("ENTREGADO"),
            )