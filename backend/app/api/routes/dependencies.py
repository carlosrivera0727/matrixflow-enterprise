from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import AuthenticationError
from app.schemas.auth import AuthenticatedUser
from app.schemas.common import UserRole
from app.services.auth_service import AuthService


DatabaseSession = Annotated[Session, Depends(get_db)]

bearer_scheme = HTTPBearer(auto_error=False)

BearerCredentials = Annotated[
    HTTPAuthorizationCredentials | None,
    Depends(bearer_scheme),
]


def _unauthorized(
    detail: str = "No se pudo validar la sesión.",
) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: BearerCredentials,
    session: DatabaseSession,
) -> AuthenticatedUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _unauthorized(
            "Debes iniciar sesión para acceder a este recurso."
        )

    try:
        return AuthService(session).current_user(
            credentials.credentials
        )
    except AuthenticationError as exc:
        raise _unauthorized() from exc


CurrentUser = Annotated[
    AuthenticatedUser,
    Depends(get_current_user),
]


def require_roles(
    *allowed_roles: UserRole,
) -> Callable[[AuthenticatedUser], AuthenticatedUser]:

    allowed = set(allowed_roles)

    def verify_role(
        current_user: CurrentUser,
    ) -> AuthenticatedUser:

        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para realizar esta acción.",
            )

        return current_user

    return verify_role


AdministratorUser = Annotated[
    AuthenticatedUser,
    Depends(
        require_roles(UserRole.ADMINISTRATOR)
    ),
]


BusinessUser = Annotated[
    AuthenticatedUser,
    Depends(
        require_roles(
            UserRole.ADMINISTRATOR,
            UserRole.ANALYST,
        )
    ),
]


ReportUser = Annotated[
    AuthenticatedUser,
    Depends(
        require_roles(
            UserRole.ADMINISTRATOR,
            UserRole.ANALYST,
            UserRole.READ_ONLY,
        )
    ),
]