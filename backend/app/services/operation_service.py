from __future__ import annotations

from sqlalchemy.orm import Session

<<<<<<< HEAD
from app.algorithms import (
    AlgorithmError,
    LinearAlgebraEngine,
    NumPyLinearAlgebraEngine,
)
from app.core.exceptions import InvalidOperationError, ResourceNotFoundError
from app.models.operation import Operation
from app.models.matrix import Matrix
from app.models.vector import Vector
=======
from app.algorithms.numpy_engine import NumPyLinearAlgebraEngine
from app.core.exceptions import ResourceNotFoundError
from app.models.operation import Operation
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0
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
<<<<<<< HEAD
    """Executes mathematical use cases and persists their results."""
=======
    """Ejecuta operaciones de álgebra lineal con NumPy y guarda el resultado."""
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

    def __init__(
        self,
        session: Session,
        *,
        engine: LinearAlgebraEngine | None = None,
    ) -> None:
        super().__init__(session)

        self.operations = OperationRepository(session)
        self.vectors = VectorRepository(session)
        self.matrices = MatrixRepository(session)
<<<<<<< HEAD
        self.engine = engine or NumPyLinearAlgebraEngine()
=======
        self.engine = NumPyLinearAlgebraEngine()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

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

<<<<<<< HEAD
    def execute(self, data: OperationCreate, *, user: str) -> OperationResponse:
        try:
            result = (
                self._execute_vector(data)
                if data.category == OperationCategory.VECTOR
                else self._execute_matrix(data)
            )
        except AlgorithmError as exc:
            raise InvalidOperationError(str(exc)) from exc

        return self.record(data, result=result, user=user)
=======
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
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

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
<<<<<<< HEAD
            operands.append(f"coeficienteB={data.coefficient_b:g}")
        return f"{data.operation_type.value}: " + ", ".join(operands)

    def _execute_vector(self, data: OperationCreate) -> OperationResultValue:
        first = self._get_vector(data.first_id)
        operation_type = data.operation_type

        if operation_type == OperationType.SCALE:
            return self.engine.scale_vector(first.values, self._required_scalar(data))

        second = self._get_vector(self._required_second_id(data))
        if operation_type == OperationType.ADD:
            return self.engine.add_vectors(first.values, second.values)
        if operation_type == OperationType.SUBTRACT:
            return self.engine.subtract_vectors(first.values, second.values)
        if operation_type == OperationType.DOT_PRODUCT:
            return self.engine.dot_product(first.values, second.values)
        if operation_type == OperationType.LINEAR_COMBINATION:
            if data.coefficient_b is None:
                raise InvalidOperationError(
                    "La combinación lineal requiere el coeficiente B."
                )
            return self.engine.linear_combination(
                first.values,
                second.values,
                self._required_scalar(data),
                data.coefficient_b,
            )
        raise InvalidOperationError("La operación vectorial no está soportada.")

    def _execute_matrix(self, data: OperationCreate) -> OperationResultValue:
        first = self._get_matrix(data.first_id)
        operation_type = data.operation_type

        if operation_type == OperationType.TRANSPOSE:
            return self.engine.transpose_matrix(first.values)
        if operation_type == OperationType.SCALE:
            return self.engine.scale_matrix(first.values, self._required_scalar(data))

        second = self._get_matrix(self._required_second_id(data))
        if operation_type == OperationType.ADD:
            return self.engine.add_matrices(first.values, second.values)
        if operation_type == OperationType.SUBTRACT:
            return self.engine.subtract_matrices(first.values, second.values)
        if operation_type == OperationType.MULTIPLY:
            return self.engine.multiply_matrices(first.values, second.values)
        raise InvalidOperationError("La operación matricial no está soportada.")

    def _get_vector(self, vector_id: int) -> Vector:
        vector = self.vectors.get_by_id(vector_id)
        if vector is None:
            raise ResourceNotFoundError("El vector solicitado no existe.")
        return vector

    def _get_matrix(self, matrix_id: int) -> Matrix:
        matrix = self.matrices.get_by_id(matrix_id)
        if matrix is None:
            raise ResourceNotFoundError("La matriz solicitada no existe.")
        return matrix

    @staticmethod
    def _required_second_id(data: OperationCreate) -> int:
        if data.second_id is None:
            raise InvalidOperationError(
                "La operación seleccionada requiere un segundo operando."
            )
        return data.second_id

    @staticmethod
    def _required_scalar(data: OperationCreate) -> float:
        if data.scalar is None:
            raise InvalidOperationError(
                "La operación seleccionada requiere un escalar."
            )
        return data.scalar
=======
            operands.append(
                f"coeficienteB={data.coefficient_b:g}"
            )

        return (
            f"{data.operation_type.value}: "
            + ", ".join(operands)
        )
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0
