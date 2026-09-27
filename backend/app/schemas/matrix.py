from datetime import datetime
from typing import Annotated

from pydantic import Field, model_validator

from app.schemas.common import APIModel, FiniteNumber, PositiveId, UpdateModel


MatrixRow = Annotated[list[FiniteNumber], Field(min_length=1, max_length=50)]
MatrixValues = Annotated[list[MatrixRow], Field(min_length=1, max_length=50)]


def validate_rectangular(values: MatrixValues) -> MatrixValues:
    width = len(values[0])
    if any(len(row) != width for row in values):
        raise ValueError("Todas las filas de la matriz deben tener la misma longitud.")
    return values


class MatrixBase(APIModel):
    name: str = Field(min_length=3, max_length=150)
    description: str = Field(min_length=3, max_length=255)
    values: MatrixValues

    @model_validator(mode="after")
    def ensure_rectangular_values(self):
        self.values = validate_rectangular(self.values)
        return self


class MatrixCreate(MatrixBase):
    pass


class MatrixUpdate(UpdateModel):
    name: str | None = Field(default=None, min_length=3, max_length=150)
    description: str | None = Field(default=None, min_length=3, max_length=255)
    values: MatrixValues | None = None

    @model_validator(mode="after")
    def ensure_rectangular_values(self):
        if self.values is not None:
            self.values = validate_rectangular(self.values)
        return self


class MatrixResponse(MatrixBase):
    id: PositiveId
    created_at: datetime
