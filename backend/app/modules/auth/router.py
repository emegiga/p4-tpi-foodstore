from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import get_current_active_user
from app.modules.auth.schemas import UserCreate
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, service: Annotated[AuthService, Depends(get_auth_service)]):
    return service.register(user_in)


@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    service: Annotated[AuthService, Depends(get_auth_service)],
):
    token = service.authenticate(form_data.username, form_data.password)
    # el token viaja solo en la cookie HttpOnly, nunca en el cuerpo
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,  # True en producción con HTTPS
    )
    return {"message": "Login exitoso"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False)
    return {"message": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def read_me(current_user: Annotated[UserPublic, Depends(get_current_active_user)]):
    return current_user