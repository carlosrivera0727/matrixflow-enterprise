from datetime import datetime

from pydantic import Field

from app.schemas.common import APIModel, FiniteNumber, PositiveId, SaleStatus


class SaleCreate(APIModel):
    branch_id: PositiveId
    product_id: PositiveId
    quantity: int = Field(gt=0)


class SaleResponse(APIModel):
    id: PositiveId
    code: str = Field(min_length=1, max_length=30)
    branch_id: PositiveId
    product_id: PositiveId
    quantity: int = Field(gt=0)
    unit_price: FiniteNumber = Field(ge=0)
    total: FiniteNumber = Field(ge=0)
    date: datetime
    status: SaleStatus
