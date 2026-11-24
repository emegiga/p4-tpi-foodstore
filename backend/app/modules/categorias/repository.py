from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):

    def __init__(self, session: Session):
        super().__init__(Categoria, session)

    def list_activas(self) -> list[Categoria]:
        query = select(Categoria).where(Categoria.activo == True).order_by(Categoria.nombre)  # noqa: E712
        return list(self.session.exec(query).all())

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        return self.session.exec(select(Categoria).where(Categoria.nombre == nombre)).first() # incluye las dadas de baja (baja lógica no libera el nombre)