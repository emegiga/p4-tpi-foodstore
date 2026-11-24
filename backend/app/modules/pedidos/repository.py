from datetime import datetime

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):

    def __init__(self, session: Session):
        super().__init__(Pedido, session)

    def list_by_usuario(
        self,
        usuario_id: int | None,
        estado: str | None,
        skip: int,
        limit: int,
    ) -> tuple[int, list[Pedido]]:
        """Pedidos de un usuario (o de todos si usuario_id es None), con filtro opcional por estado"""
        filtros = []
        if usuario_id is not None:
            filtros.append(Pedido.usuario_id == usuario_id)
        if estado is not None:
            filtros.append(Pedido.estado == estado)

        total = self.session.exec(select(func.count()).select_from(Pedido).where(*filtros)).one()
        items = self.session.exec(
            select(Pedido).where(*filtros).order_by(col(Pedido.id).desc()).offset(skip).limit(limit)
        ).all()
        return total, list(items)

    def count_by_estado(self, estado: str) -> int:
        return self.session.exec(select(func.count()).select_from(Pedido).where(Pedido.estado == estado)).one()

    def count_desde(self, desde: datetime) -> int:
        return self.session.exec(select(func.count()).select_from(Pedido).where(Pedido.created_at >= desde)).one()

    def sum_total_by_estado(self, estado: str) -> float:
        total = self.session.exec(select(func.sum(Pedido.total)).where(Pedido.estado == estado)).one()
        return float(total or 0)


class DetallePedidoRepository(BaseRepository[DetallePedido]):

    def __init__(self, session: Session):
        super().__init__(DetallePedido, session)