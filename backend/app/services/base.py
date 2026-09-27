from collections.abc import Iterator
from contextlib import contextmanager

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
        except Exception:
            self.session.rollback()
            raise

    def rollback(self) -> None:
        self.session.rollback()

    @contextmanager
    def transaction(self) -> Iterator[None]:
        """Commit a complete use case or roll it back as one unit."""

        try:
            yield
            self.commit()
        except PersistenceError:
            raise
        except SQLAlchemyError as exc:
            self.session.rollback()
            raise PersistenceError("No se pudo guardar la transacción.") from exc
