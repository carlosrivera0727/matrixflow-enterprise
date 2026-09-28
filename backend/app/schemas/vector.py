from datetime import datetime
from typing import Annotated

from pydantic import Field

from app.schemas.common import APIModel, FiniteNumber, PositiveId, UpdateModel


VectorValues = Annotated[list[FiniteNumber], Field(min_length=1, max_length=1000)]


class VectorBase(APIModel):
    name: str = Field(min_length=3, max_length=150)
    description: str = Field(min_length=3, max_length=255)
    values: VectorValues


class VectorCreate(VectorBase):
    pass


class VectorUpdate(UpdateModel):
    name: str | None = Field(default=None, min_length=3, max_length=150)
    description: str | None = Field(default=None, min_length=3, max_length=255)
    values: VectorValues | None = None


class VectorResponse(VectorBase):
    id: PositiveId
    created_at: datetime
