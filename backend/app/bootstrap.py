from __future__ import annotations

from collections.abc import Callable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal, initialize_database_schema
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.user_service import UserService


DEMO_USERS = (
    UserCreate(
        name="Administrador MatrixFlow",
        email="admin@matrixflow.pe",
        password="demo123",
        role="Administrador",
    ),
    UserCreate(
        name="Analista MatrixFlow",
        email="analista@matrixflow.pe",
        password="demo123",
        role="Analista",
    ),
    UserCreate(
        name="Consulta MatrixFlow",
        email="consulta@matrixflow.pe",
        password="demo123",
        role="Consulta",
    ),
)


def seed_development_users(
    session_factory: Callable[[], Session] = SessionLocal,
) -> None:
    """Create the documented demo accounts without overwriting existing users."""

    with session_factory() as session:
        service = UserService(session)
        for user_data in DEMO_USERS:
            exists = session.scalar(
                select(User.id).where(User.email == str(user_data.email).lower())
            )
            if exists is None:
                service.create(user_data)


def prepare_development_database() -> None:
    """Prepare a local database only when the application runs in development."""

    if settings.environment.lower() != "development":
        return
    if settings.auto_create_tables:
        initialize_database_schema()
    if settings.seed_demo_users:
        seed_development_users()
