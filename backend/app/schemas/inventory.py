from datetime import datetime

from pydantic import Field

from app.schemas.common import APIModel, MovementType, PositiveId


class InventoryCreate(APIModel):
    branch_id: PositiveId
    product_id: PositiveId
    stock: int = Field(ge=0)


class InventoryAdjustment(APIModel):
    stock: int = Field(ge=0)
    reason: str = Field(min_length=5, max_length=255)


class InventoryResponse(APIModel):
    id: PositiveId
    branch_id: PositiveId
    product_id: PositiveId
    stock: int = Field(ge=0)
    updated_at: datetime


class InventoryMovementCreate(APIModel):
    inventory_id: PositiveId
    branch_id: PositiveId
    product_id: PositiveId
    type: MovementType
    quantity: int = Field(ge=0)
    previous_stock: int = Field(ge=0)
    new_stock: int = Field(ge=0)
    reason: str = Field(min_length=3, max_length=255)
    user: str = Field(min_length=2, max_length=150)


class InventoryMovementResponse(InventoryMovementCreate):
    id: PositiveId
    created_at: datetime
