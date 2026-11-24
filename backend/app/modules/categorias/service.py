from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


# ─── Excepciones de dominio (el Router las traduce a HTTP) ───────────────────

class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:

    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def _get_activa(self, uow: CategoriaUnitOfWork, categoria_id: int) -> Categoria:
        categoria = uow.categorias.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:   # una categoría dada de baja se trata como inexistente
            raise CategoriaNoEncontrada()
        return categoria

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_activas()]

    def obtener(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._get_activa(uow, categoria_id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise NombreDuplicado()
            categoria = uow.categorias.add(Categoria.model_validate(data))
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._get_activa(uow, categoria_id)
            cambios = data.model_dump(exclude_unset=True)

            if "nombre" in cambios:
                otra = uow.categorias.get_by_nombre(cambios["nombre"])
                if otra is not None and otra.id != categoria_id:
                    raise NombreDuplicado()

            categoria.sqlmodel_update(cambios)
            uow.categorias.update(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = self._get_activa(uow, categoria_id)
            categoria.activo = False  # baja lógica
            uow.categorias.update(categoria)