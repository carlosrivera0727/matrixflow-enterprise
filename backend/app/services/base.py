from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import PersistenceError


class BaseService:
    """Base class that owns the transaction boundary for a use case."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def commit(self) -> None:
        try:
            self.session.commit()
        except SQLAlchemyError as exc:
            self.session.rollback()
            raise PersistenceError("No se pudo guardar la transacción.") from exc

    def rollback(self) -> None:
        self.session.rollback()
