from pydantic import BaseModel


class SaleCreate(BaseModel):
    product_id: int
    quantity: int
    total: float


class SaleResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    total: float