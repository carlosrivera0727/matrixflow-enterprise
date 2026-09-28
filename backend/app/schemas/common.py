from enum import Enum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, model_validator


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


FiniteNumber = Annotated[float, Field(allow_inf_nan=False)]
PositiveId = Annotated[int, Field(gt=0)]


class APIModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        str_strip_whitespace=True,
        extra="forbid",
    )


class UpdateModel(APIModel):
    @model_validator(mode="after")
    def require_at_least_one_change(self):
        if not self.model_fields_set:
            raise ValueError("Debes proporcionar al menos un campo para actualizar.")
        return self


class CompanyStatus(str, Enum):
    ACTIVE = "Activa"
    INACTIVE = "Inactiva"


class RecordStatus(str, Enum):
    ACTIVE = "Activo"
    INACTIVE = "Inactivo"


class SaleStatus(str, Enum):
    COMPLETED = "Completada"
    CANCELLED = "Anulada"


class MovementType(str, Enum):
    INPUT = "Entrada"
    OUTPUT = "Salida"
    ADJUSTMENT = "Ajuste"


class UserRole(str, Enum):
    ADMINISTRATOR = "Administrador"
    ANALYST = "Analista"
    READ_ONLY = "Consulta"


class OperationCategory(str, Enum):
    VECTOR = "Vector"
    MATRIX = "Matriz"


class OperationStatus(str, Enum):
    COMPLETED = "Completada"
    ERROR = "Error"


class OperationType(str, Enum):
    ADD = "Suma"
    SUBTRACT = "Resta"
    DOT_PRODUCT = "Producto escalar"
    SCALE = "Multiplicación por escalar"
    LINEAR_COMBINATION = "Combinación lineal"
    MULTIPLY = "Multiplicación"
    TRANSPOSE = "Transposición"
