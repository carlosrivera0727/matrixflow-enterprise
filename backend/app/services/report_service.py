from __future__ import annotations

from sqlalchemy.orm import Session

from app.repositories.report_repository import ReportRepository
from app.schemas.report import BranchSalesReport, ProductStockReport, ReportResponse
from app.services.base import BaseService


class ReportService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.reports = ReportRepository(session)

    def get_dashboard(self) -> ReportResponse:
        total_sales, units_sold, operations_count = self.reports.totals()
        return ReportResponse(
            total_sales=total_sales,
            units_sold=units_sold,
            operations_count=operations_count,
            sales_by_branch=[
                BranchSalesReport(name=name, sales=sales, units=units)
                for name, sales, units in self.reports.sales_by_branch()
            ],
            stock_by_product=[
                ProductStockReport(name=name, stock=stock, minimum=minimum)
                for name, stock, minimum in self.reports.stock_by_product()
            ],
        )
