from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundError
from app.models.matrix import Matrix
from app.models.matrix_value import MatrixValue
from app.repositories.matrix_repository import MatrixRepository
from app.schemas.matrix import MatrixCreate, MatrixResponse, MatrixUpdate
from app.services.base import BaseService


class MatrixService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.matrices = MatrixRepository(session)

    def list(self, *, offset: int = 0, limit: int = 100) -> list[MatrixResponse]:
        return [
            MatrixResponse.model_validate(matrix)
            for matrix in self.matrices.list(offset=offset, limit=limit)
        ]

    def get(self, matrix_id: int) -> MatrixResponse:
        return MatrixResponse.model_validate(self._get_matrix(matrix_id))

    def create(self, data: MatrixCreate) -> MatrixResponse:
        matrix = Matrix(
            name=data.name,
            description=data.description,
            value_records=self._value_records(data.values),
        )
        with self.transaction():
            self.matrices.add(matrix)
        return MatrixResponse.model_validate(matrix)

    def update(self, matrix_id: int, data: MatrixUpdate) -> MatrixResponse:
        matrix = self._get_matrix(matrix_id)
        values = data.model_dump(exclude_unset=True)
        matrix_values = values.pop("values", None)
        with self.transaction():
            if matrix_values is not None:
                self.matrices.replace_values(
                    matrix,
                    self._value_records(matrix_values),
                )
            self.matrices.update(matrix, values)
        return MatrixResponse.model_validate(matrix)

    def delete(self, matrix_id: int) -> None:
        matrix = self._get_matrix(matrix_id)
        with self.transaction():
            self.matrices.delete(matrix)

    def _get_matrix(self, matrix_id: int) -> Matrix:
        matrix = self.matrices.get_by_id(matrix_id)
        if matrix is None:
            raise ResourceNotFoundError("La matriz solicitada no existe.")
        return matrix

    @staticmethod
    def _value_records(values: list[list[float]]) -> list[MatrixValue]:
        return [
            MatrixValue(row_index=row, column_index=column, value=value)
            for row, values_row in enumerate(values)
            for column, value in enumerate(values_row)
        ]
