from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["usuarios"])

solo_admin = require_role(["admin"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


@router.get("", response_model=list[UserPublic])
def listar_usuarios(
    _admin: Annotated[UserPublic, Depends(solo_admin)],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
):
    return service.listar()


@router.post("/{user_id}/activar", response_model=UserPublic)
def activar_usuario(
    user_id: int,
    admin: Annotated[UserPublic, Depends(solo_admin)],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
):
    return service.set_disabled(user_id, disabled=False, admin_id=admin.id)


@router.post("/{user_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    user_id: int,
    admin: Annotated[UserPublic, Depends(solo_admin)],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
):
    return service.set_disabled(user_id, disabled=True, admin_id=admin.id)