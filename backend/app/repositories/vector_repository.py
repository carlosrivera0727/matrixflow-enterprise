from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.vector import Vector
from app.models.vector_value import VectorValue
from app.repositories.base import BaseRepository


class VectorRepository(BaseRepository[Vector]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Vector)

    def get_by_id(self, entity_id: int) -> Vector | None:
        statement = (
            select(Vector)
            .options(selectinload(Vector.value_records))
            .where(Vector.id == entity_id)
        )
        return self.session.scalar(statement)

    def list(self, *, offset: int = 0, limit: int = 100) -> Sequence[Vector]:
        statement = (
            select(Vector)
            .options(selectinload(Vector.value_records))
            .offset(offset)
            .limit(limit)
        )
        return self.session.scalars(statement).all()

    def replace_values(self, vector: Vector, values: list[VectorValue]) -> None:
        vector.value_records.clear()
        self.session.flush()
        vector.value_records.extend(values)
        self.session.flush()
