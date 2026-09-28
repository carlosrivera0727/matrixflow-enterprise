from collections.abc import Mapping, Sequence
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import Base


ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """Common persistence operations.

    Repositories flush changes so generated values are available, but they never
    commit or roll back. Transaction boundaries belong to the service layer.
    """

    def __init__(self, session: Session, model: type[ModelT]) -> None:
        self.session = session
        self.model = model

    def get_by_id(self, entity_id: int) -> ModelT | None:
        return self.session.get(self.model, entity_id)

    def list(self, *, offset: int = 0, limit: int = 100) -> Sequence[ModelT]:
        statement = select(self.model).offset(offset).limit(limit)
        return self.session.scalars(statement).all()

    def add(self, instance: ModelT) -> ModelT:
        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance

    def update(self, instance: ModelT, values: Mapping[str, Any]) -> ModelT:
        for field, value in values.items():
            setattr(instance, field, value)

        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance

    def delete(self, instance: ModelT) -> None:
        self.session.delete(instance)
        self.session.flush()
