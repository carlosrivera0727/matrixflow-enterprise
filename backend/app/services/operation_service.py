from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundError
from app.models.operation import Operation
from app.repositories.operation_repository import OperationRepository
from app.schemas.common import OperationStatus
from app.schemas.operation import (
    OperationCreate,
    OperationResponse,
    OperationResult as OperationResultValue,
)
from app.services.base import BaseService


class OperationService(BaseService):
    """Persists algorithm results; calculation remains in the algorithm layer."""

    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.operations = OperationRepository(session)

    def list(self, *, limit: int = 100) -> list[OperationResponse]:
        return [
            OperationResponse.model_validate(operation)
            for operation in self.operations.list_recent(limit=limit)
        ]

    def get(self, operation_id: int) -> OperationResponse:
        operation = self.operations.get_by_id(operation_id)
        if operation is None:
            raise ResourceNotFoundError("La operación solicitada no existe.")
        return OperationResponse.model_validate(operation)

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
        operands = [f"{data.category.value} #{data.first_id}"]
        if data.second_id is not None:
            operands.append(f"{data.category.value} #{data.second_id}")
        if data.scalar is not None:
            operands.append(f"escalar={data.scalar:g}")
        if data.coefficient_b is not None:
            operands.append(f"coeficienteB={data.coefficient_b:g}")
        return f"{data.operation_type.value}: " + ", ".join(operands)
