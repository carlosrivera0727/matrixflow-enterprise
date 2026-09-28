from __future__ import annotations

from sqlalchemy.orm import Session

from app.algorithms.numpy_engine import NumPyLinearAlgebraEngine
from app.core.exceptions import ResourceNotFoundError
from app.models.operation import Operation
from app.repositories.matrix_repository import MatrixRepository
from app.repositories.operation_repository import OperationRepository
from app.repositories.vector_repository import VectorRepository
from app.schemas.common import OperationCategory, OperationStatus, OperationType
from app.schemas.operation import (
    OperationCreate,
    OperationResponse,
    OperationResult as OperationResultValue,
)
from app.services.base import BaseService


class OperationService(BaseService):
    """Ejecuta operaciones de álgebra lineal con NumPy y guarda el resultado."""

    def __init__(self, session: Session) -> None:
        super().__init__(session)

        self.operations = OperationRepository(session)
        self.vectors = VectorRepository(session)
        self.matrices = MatrixRepository(session)
        self.engine = NumPyLinearAlgebraEngine()

    def list(self, *, limit: int = 100) -> list[OperationResponse]:
        return [
            OperationResponse.model_validate(operation)
            for operation in self.operations.list_recent(limit=limit)
        ]

    def get(self, operation_id: int) -> OperationResponse:
        operation = self.operations.get_by_id(operation_id)

        if operation is None:
            raise ResourceNotFoundError(
                "La operación solicitada no existe."
            )

        return OperationResponse.model_validate(operation)

    def execute(
        self,
        data: OperationCreate,
        *,
        user: str,
    ) -> OperationResponse:

        if data.category == OperationCategory.VECTOR:
            result = self._execute_vector(data)

        else:
            result = self._execute_matrix(data)

        return self.record(
            data,
            result=result,
            user=user,
        )

    def _execute_vector(
        self,
        data: OperationCreate,
    ) -> OperationResultValue:

        first = self.vectors.get_by_id(data.first_id)

        if first is None:
            raise ResourceNotFoundError(
                f"El vector #{data.first_id} no existe."
            )

        left = first.values

        if data.operation_type == OperationType.ADD:
            second = self._get_vector(data.second_id)
            return self.engine.add_vectors(left, second.values)

        if data.operation_type == OperationType.SUBTRACT:
            second = self._get_vector(data.second_id)
            return self.engine.subtract_vectors(left, second.values)

        if data.operation_type == OperationType.DOT_PRODUCT:
            second = self._get_vector(data.second_id)
            return self.engine.dot_product(left, second.values)

        if data.operation_type == OperationType.SCALE:
            return self.engine.scale_vector(
                left,
                data.scalar,
            )

        if data.operation_type == OperationType.LINEAR_COMBINATION:
            second = self._get_vector(data.second_id)

            return self.engine.linear_combination(
                left,
                second.values,
                data.scalar,
                data.coefficient_b,
            )

        raise ValueError(
            f"Operación vectorial no soportada: "
            f"{data.operation_type.value}"
        )

    def _execute_matrix(
        self,
        data: OperationCreate,
    ) -> OperationResultValue:

        first = self.matrices.get_by_id(data.first_id)

        if first is None:
            raise ResourceNotFoundError(
                f"La matriz #{data.first_id} no existe."
            )

        left = first.values

        if data.operation_type == OperationType.ADD:
            second = self._get_matrix(data.second_id)
            return self.engine.add_matrices(
                left,
                second.values,
            )

        if data.operation_type == OperationType.SUBTRACT:
            second = self._get_matrix(data.second_id)
            return self.engine.subtract_matrices(
                left,
                second.values,
            )

        if data.operation_type == OperationType.MULTIPLY:
            second = self._get_matrix(data.second_id)
            return self.engine.multiply_matrices(
                left,
                second.values,
            )

        if data.operation_type == OperationType.TRANSPOSE:
            return self.engine.transpose_matrix(left)

        if data.operation_type == OperationType.SCALE:
            return self.engine.scale_matrix(
                left,
                data.scalar,
            )

        raise ValueError(
            f"Operación matricial no soportada: "
            f"{data.operation_type.value}"
        )

    def _get_vector(self, vector_id: int | None):
        if vector_id is None:
            raise ResourceNotFoundError(
                "Se requiere un segundo vector."
            )

        vector = self.vectors.get_by_id(vector_id)

        if vector is None:
            raise ResourceNotFoundError(
                f"El vector #{vector_id} no existe."
            )

        return vector

    def _get_matrix(self, matrix_id: int | None):
        if matrix_id is None:
            raise ResourceNotFoundError(
                "Se requiere una segunda matriz."
            )

        matrix = self.matrices.get_by_id(matrix_id)

        if matrix is None:
            raise ResourceNotFoundError(
                f"La matriz #{matrix_id} no existe."
            )

        return matrix

    def record(
        self,
        data: OperationCreate,
        *,
        result: OperationResultValue,
        user: str,
        status: OperationStatus = OperationStatus.COMPLETED,
    ) -> OperationResponse:

        operation = Operation(
            category=data.category.value,
            operation_type=data.operation_type.value,
            inputs=self._describe_inputs(data),
            result=result,
            user=user,
            status=status.value,
        )

        with self.transaction():
            self.operations.add(operation)

        return OperationResponse.model_validate(operation)

    @staticmethod
    def _describe_inputs(data: OperationCreate) -> str:

        operands = [
            f"{data.category.value} #{data.first_id}"
        ]

        if data.second_id is not None:
            operands.append(
                f"{data.category.value} #{data.second_id}"
            )

        if data.scalar is not None:
            operands.append(
                f"escalar={data.scalar:g}"
            )

        if data.coefficient_b is not None:
            operands.append(
                f"coeficienteB={data.coefficient_b:g}"
            )

        return (
            f"{data.operation_type.value}: "
            + ", ".join(operands)
        )