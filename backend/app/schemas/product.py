from pydantic import Field

from app.schemas.common import APIModel, FiniteNumber, PositiveId, RecordStatus, UpdateModel


class ProductBase(APIModel):
    sku: str = Field(min_length=3, max_length=50)
    name: str = Field(min_length=3, max_length=150)
    category: str = Field(min_length=2, max_length=100)
    price: FiniteNumber = Field(gt=0)
    minimum_stock: int = Field(ge=0)
    status: RecordStatus = RecordStatus.ACTIVE


class ProductCreate(ProductBase):
    pass


class ProductUpdate(UpdateModel):
    sku: str | None = Field(default=None, min_length=3, max_length=50)
    name: str | None = Field(default=None, min_length=3, max_length=150)
    category: str | None = Field(default=None, min_length=2, max_length=100)
    price: FiniteNumber | None = Field(default=None, gt=0)
    minimum_stock: int | None = Field(default=None, ge=0)
    status: RecordStatus | None = None


class ProductResponse(ProductBase):
    id: PositiveId
