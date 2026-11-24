from fastapi import HTTPException, status

from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.get_all()]

    def set_disabled(self, user_id: int, disabled: bool, admin_id: int) -> UserPublic:
        with self.uow as uow:
            user = uow.usuarios.get_by_id(user_id)
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
            if disabled and user.id == admin_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No podés desactivar tu propia cuenta")
            user.disabled = disabled  # idempotente
            uow.usuarios.update(user)
            return UserPublic.model_validate(user)