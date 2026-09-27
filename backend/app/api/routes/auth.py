from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CurrentUser, DatabaseSession
from app.core.exceptions import AuthenticationError
from app.schemas.auth import AuthenticatedUser, LoginRequest, LoginResponse
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, session: DatabaseSession) -> LoginResponse:
    try:
        return AuthService(session).login(data)
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


@router.get("/me", response_model=AuthenticatedUser)
def get_authenticated_user(current_user: CurrentUser) -> AuthenticatedUser:
    return current_user
