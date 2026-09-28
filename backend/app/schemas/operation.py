from datetime import datetime
from typing import TypeAlias

from pydantic import AliasChoices, Field, model_validator

from app.schemas.common import (
    APIModel,
    FiniteNumber,
    OperationCategory,
    OperationStatus,
    OperationType,
    PositiveId,
)


OperationResult: TypeAlias = (
    FiniteNumber | list[FiniteNumber] | list[list[FiniteNumber]]
)

VECTOR_OPERATIONS = {
    OperationType.ADD,
    OperationType.SUBTRACT,
    OperationType.DOT_PRODUCT,
    OperationType.SCALE,
    OperationType.LINEAR_COMBINATION,
}
MATRIX_OPERATIONS = {
    OperationType.ADD,
    OperationType.SUBTRACT,
    OperationType.MULTIPLY,
    OperationType.TRANSPOSE,
    OperationType.SCALE,
}
SECOND_OPERAND_OPERATIONS = {
    OperationType.ADD,
    OperationType.SUBTRACT,
    OperationType.DOT_PRODUCT,
    OperationType.LINEAR_COMBINATION,
    OperationType.MULTIPLY,
}


class OperationCreate(APIModel):
    category: OperationCategory
    operation_type: OperationType
    first_id: PositiveId
    second_id: PositiveId | None = None
    scalar: FiniteNumber | None = None
    coefficient_b: FiniteNumber | None = None

    @model_validator(mode="after")
    def validate_operation_configuration(self):
        allowed = (
            VECTOR_OPERATIONS
            if self.category == OperationCategory.VECTOR
            else MATRIX_OPERATIONS
        )
        if self.operation_type not in allowed:
            raise ValueError(
                f"La operación {self.operation_type.value} no corresponde a "
                f"la categoría {self.category.value}."
            )

        if self.operation_type in SECOND_OPERAND_OPERATIONS and self.second_id is None:
            raise ValueError("La operación seleccionada requiere un segundo operando.")

        if self.operation_type in {
            OperationType.SCALE,
            OperationType.LINEAR_COMBINATION,
        } and self.scalar is None:
            raise ValueError("La operación seleccionada requiere un escalar.")

        if (
            self.operation_type == OperationType.LINEAR_COMBINATION
            and self.coefficient_b is None
        ):
            raise ValueError("La combinación lineal requiere el coeficiente B.")

        return self


class OperationResponse(APIModel):
    id: PositiveId
    operation_type: OperationType = Field(
        validation_alias=AliasChoices("operationType", "type"),
        serialization_alias="type",
    )
    category: OperationCategory
    inputs: str = Field(min_length=1, max_length=500)
    result: OperationResult
    created_at: datetime
    user: str = Field(min_length=2, max_length=150)
    status: OperationStatus
