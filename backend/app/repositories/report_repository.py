from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.branch import Branch
from app.models.inventory import Inventory
from app.models.operation import Operation
from app.models.product import Product
from app.models.sale import Sale
from app.models.sale_detail import SaleDetail


class ReportRepository:
    """Read-only aggregate queries used by the dashboard report."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def totals(self) -> tuple[float, int, int]:
        total_sales = self.session.scalar(select(func.coalesce(func.sum(Sale.total), 0)))
        units_sold = self.session.scalar(
            select(func.coalesce(func.sum(SaleDetail.quantity), 0))
        )
        operations_count = self.session.scalar(select(func.count(Operation.id)))
        return float(total_sales or 0), int(units_sold or 0), int(operations_count or 0)

    def sales_by_branch(self) -> list[tuple[str, float, int]]:
        sale_totals = (
            select(
                Sale.branch_id.label("branch_id"),
                func.sum(Sale.total).label("sales"),
            )
            .group_by(Sale.branch_id)
            .subquery()
        )
        unit_totals = (
            select(
                Sale.branch_id.label("branch_id"),
                func.sum(SaleDetail.quantity).label("units"),
            )
            .join(SaleDetail, SaleDetail.sale_id == Sale.id)
            .group_by(Sale.branch_id)
            .subquery()
        )
        statement = (
            select(
                Branch.name,
                func.coalesce(sale_totals.c.sales, 0),
                func.coalesce(unit_totals.c.units, 0),
            )
            .outerjoin(sale_totals, sale_totals.c.branch_id == Branch.id)
            .outerjoin(unit_totals, unit_totals.c.branch_id == Branch.id)
            .order_by(Branch.name)
        )
        return [
            (name, float(sales), int(units))
            for name, sales, units in self.session.execute(statement).all()
        ]

    def stock_by_product(self) -> list[tuple[str, int, int]]:
        statement = (
            select(
                Product.name,
                func.coalesce(func.sum(Inventory.quantity), 0),
                Product.minimum_stock,
            )
            .outerjoin(Inventory, Inventory.product_id == Product.id)
            .group_by(Product.id, Product.name, Product.minimum_stock)
            .order_by(Product.name)
        )
        return [
            (name, int(stock), int(minimum))
            for name, stock, minimum in self.session.execute(statement).all()
        ]
