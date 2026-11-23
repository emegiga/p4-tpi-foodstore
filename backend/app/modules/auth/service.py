from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.schemas import UserCreate
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def register(self, user_in: UserCreate) -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(user_in.username):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El nombre de usuario ya está en uso")
            if uow.usuarios.get_by_email(user_in.email):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado")

            usuario = uow.usuarios.add(Usuario(
                username=user_in.username,
                full_name=user_in.full_name,
                email=user_in.email,
                hashed_password=hash_password(user_in.password),
                role="user",  # el registro público siempre crea "user"
            ))
            return UserPublic.model_validate(usuario)

    def authenticate(self, username: str, password: str) -> str:
        with self.uow as uow:
            user = uow.usuarios.get_by_username(username)
            if not user or not verify_password(password, user.hashed_password):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")
            if user.disabled:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada")
            return create_access_token(data={"sub": user.username, "role": user.role})