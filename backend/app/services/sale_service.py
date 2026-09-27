from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models.inventory_movement import InventoryMovement
from app.models.sale import Sale
from app.models.sale_detail import SaleDetail
from app.repositories.branch_repository import BranchRepository
from app.repositories.inventory_repository import (
    InventoryMovementRepository,
    InventoryRepository,
)
from app.repositories.product_repository import ProductRepository
from app.repositories.sale_repository import SaleRepository
from app.schemas.common import MovementType
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.base import BaseService


class SaleService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.sales = SaleRepository(session)
        self.branches = BranchRepository(session)
        self.products = ProductRepository(session)
        self.inventory = InventoryRepository(session)
        self.movements = InventoryMovementRepository(session)

    def list(
        self,
        *,
        branch_id: int | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[SaleResponse]:
        records = (
            self.sales.list_by_branch(branch_id)
            if branch_id is not None
            else self.sales.list(offset=offset, limit=limit)
        )
        return [self._response(sale) for sale in records]

    def get(self, sale_id: int) -> SaleResponse:
        return self._response(self._get_sale(sale_id))

    def create(self, data: SaleCreate, *, user: str = "Sistema") -> SaleResponse:
        if self.branches.get_by_id(data.branch_id) is None:
            raise ResourceNotFoundError("La sucursal indicada no existe.")
        product = self.products.get_by_id(data.product_id)
        if product is None:
            raise ResourceNotFoundError("El producto indicado no existe.")

        inventory = self.inventory.get_position(
            branch_id=data.branch_id,
            product_id=data.product_id,
        )
        if inventory is None:
            raise ResourceNotFoundError(
                "No existe inventario para ese producto en la sucursal."
            )
        if inventory.quantity < data.quantity:
            raise ResourceConflictError("El inventario disponible es insuficiente.")

        previous_stock = inventory.quantity
        new_stock = previous_stock - data.quantity
        unit_price = product.price
        total = round(unit_price * data.quantity, 2)
        detail = SaleDetail(
            product_id=product.id,
            quantity=data.quantity,
            unit_price=unit_price,
            subtotal=total,
        )
        sale = Sale(
            code=self._new_code(),
            branch_id=data.branch_id,
            total=total,
            status="Completada",
            details=[detail],
        )

        with self.transaction():
            self.inventory.update(inventory, {"quantity": new_stock})
            self.movements.add(
                InventoryMovement(
                    inventory=inventory,
                    movement_type=MovementType.OUTPUT.value,
                    quantity=data.quantity,
                    previous_stock=previous_stock,
                    new_stock=new_stock,
                    reason=f"Venta {sale.code}",
                    user=user,
                )
            )
            self.sales.add(sale)
        return self._response(sale)

    def _get_sale(self, sale_id: int) -> Sale:
        sale = self.sales.get_by_id(sale_id)
        if sale is None:
            raise ResourceNotFoundError("La venta solicitada no existe.")
        return sale

    @staticmethod
    def _new_code() -> str:
        date = datetime.now(timezone.utc).strftime("%Y%m%d")
        return f"VEN-{date}-{uuid4().hex[:8].upper()}"

    @staticmethod
    def _response(sale: Sale) -> SaleResponse:
        detail = sale.details[0]
        return SaleResponse(
            id=sale.id,
            code=sale.code,
            branch_id=sale.branch_id,
            product_id=detail.product_id,
            quantity=detail.quantity,
            unit_price=float(detail.unit_price),
            total=float(sale.total),
            date=sale.sale_date,
            status=sale.status,
        )
