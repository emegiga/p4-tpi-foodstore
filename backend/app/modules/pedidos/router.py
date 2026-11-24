from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


NO_ENCONTRADO = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
AJENO = HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="El pedido pertenece a otro usuario")


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    data: PedidoCreate,
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
):
    try:
        return service.crear(usuario, data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (ProductoRepetido, ProductoNoDisponible, StockInsuficiente) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
):
    return service.listar(usuario, estado, skip, limit)


# se declara antes de /{pedido_id} para que "resumen" no se tome como un id
@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
):
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
):
    try:
        return service.obtener(pedido_id, usuario)
    except PedidoNoEncontrado:
        raise NO_ENCONTRADO
    except PedidoAjeno:
        raise AJENO


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado(
    pedido_id: int,
    data: CambioEstado,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
):
    try:
        return service.cambiar_estado(pedido_id, data.estado)
    except PedidoNoEncontrado:
        raise NO_ENCONTRADO
    except TransicionInvalida as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(
    pedido_id: int,
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
):
    try:
        return service.cancelar(pedido_id, usuario)
    except PedidoNoEncontrado:
        raise NO_ENCONTRADO
    except PedidoAjeno:
        raise AJENO
    except TransicionInvalida as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
