from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.matrix import Matrix
from app.models.matrix_value import MatrixValue
from app.repositories.base import BaseRepository


class MatrixRepository(BaseRepository[Matrix]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Matrix)

    def get_by_id(self, entity_id: int) -> Matrix | None:
        statement = (
            select(Matrix)
            .options(selectinload(Matrix.value_records))
            .where(Matrix.id == entity_id)
        )
        return self.session.scalar(statement)

    def list(self, *, offset: int = 0, limit: int = 100) -> Sequence[Matrix]:
        statement = (
            select(Matrix)
            .options(selectinload(Matrix.value_records))
            .offset(offset)
            .limit(limit)
        )
        return self.session.scalars(statement).all()

    def replace_values(self, matrix: Matrix, values: list[MatrixValue]) -> None:
        matrix.value_records.clear()
        self.session.flush()
        matrix.value_records.extend(values)
        self.session.flush()
