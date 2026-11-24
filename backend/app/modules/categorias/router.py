from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_role
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["categorias"])

solo_admin = [Depends(require_role(["admin"]))]


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


NO_ENCONTRADA = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
DUPLICADA = HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya existe una categoría con ese nombre")


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: Annotated[CategoriaService, Depends(get_categoria_service)]):
    return service.listar()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, service: Annotated[CategoriaService, Depends(get_categoria_service)]):
    try:
        return service.obtener(categoria_id)
    except CategoriaNoEncontrada:
        raise NO_ENCONTRADA


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED, dependencies=solo_admin)
def crear_categoria(data: CategoriaCreate, service: Annotated[CategoriaService, Depends(get_categoria_service)]):
    try:
        return service.crear(data)
    except NombreDuplicado:
        raise DUPLICADA


@router.put("/{categoria_id}", response_model=CategoriaRead, dependencies=solo_admin)
def actualizar_categoria(categoria_id: int, data: CategoriaUpdate, service: Annotated[CategoriaService, Depends(get_categoria_service)]):
    try:
        return service.actualizar(categoria_id, data)
    except CategoriaNoEncontrada:
        raise NO_ENCONTRADA
    except NombreDuplicado:
        raise DUPLICADA


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=solo_admin)
def eliminar_categoria(categoria_id: int, service: Annotated[CategoriaService, Depends(get_categoria_service)]):
    try:
        service.eliminar(categoria_id)
    except CategoriaNoEncontrada:
        raise NO_ENCONTRADA