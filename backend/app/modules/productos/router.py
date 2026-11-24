from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import require_role
from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.service import ProductoNoEncontrado, ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["productos"])

solo_admin = [Depends(require_role(["admin"]))]


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


NO_ENCONTRADO = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
CATEGORIA_NO_ENCONTRADA = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    service: Annotated[ProductoService, Depends(get_producto_service)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
):
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, service: Annotated[ProductoService, Depends(get_producto_service)]):
    try:
        return service.obtener(producto_id)
    except ProductoNoEncontrado:
        raise NO_ENCONTRADO


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED, dependencies=solo_admin)
def crear_producto(data: ProductoCreate, service: Annotated[ProductoService, Depends(get_producto_service)]):
    try:
        return service.crear(data)
    except CategoriaNoEncontrada:
        raise CATEGORIA_NO_ENCONTRADA


@router.put("/{producto_id}", response_model=ProductoRead, dependencies=solo_admin)
def actualizar_producto(producto_id: int, data: ProductoUpdate, service: Annotated[ProductoService, Depends(get_producto_service)]):
    try:
        return service.actualizar(producto_id, data)
    except ProductoNoEncontrado:
        raise NO_ENCONTRADO
    except CategoriaNoEncontrada:
        raise CATEGORIA_NO_ENCONTRADA


@router.patch("/{producto_id}/stock", response_model=ProductoRead, dependencies=solo_admin)
def cambiar_stock(producto_id: int, data: ProductoStockUpdate, service: Annotated[ProductoService, Depends(get_producto_service)]):
    try:
        return service.cambiar_stock(producto_id, data)
    except ProductoNoEncontrado:
        raise NO_ENCONTRADO


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=solo_admin)
def eliminar_producto(producto_id: int, service: Annotated[ProductoService, Depends(get_producto_service)]):
    try:
        service.eliminar(producto_id)
    except ProductoNoEncontrado:
        raise NO_ENCONTRADO