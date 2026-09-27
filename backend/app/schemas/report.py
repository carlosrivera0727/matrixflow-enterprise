from pydantic import Field

from app.schemas.common import APIModel, FiniteNumber


class BranchSalesReport(APIModel):
    name: str = Field(min_length=1, max_length=150)
    sales: FiniteNumber = Field(ge=0)
    units: int = Field(ge=0)


class ProductStockReport(APIModel):
    name: str = Field(min_length=1, max_length=150)
    stock: int = Field(ge=0)
    minimum: int = Field(ge=0)


class ReportResponse(APIModel):
    total_sales: FiniteNumber = Field(ge=0)
    units_sold: int = Field(ge=0)
    operations_count: int = Field(ge=0)
    sales_by_branch: list[BranchSalesReport]
    stock_by_product: list[ProductStockReport]
