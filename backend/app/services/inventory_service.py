from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models.inventory import Inventory
from app.models.inventory_movement import InventoryMovement
from app.repositories.branch_repository import BranchRepository
from app.repositories.inventory_repository import (
    InventoryMovementRepository,
    InventoryRepository,
)
from app.repositories.product_repository import ProductRepository
from app.schemas.common import MovementType
from app.schemas.inventory import (
    InventoryAdjustment,
    InventoryCreate,
    InventoryMovementResponse,
    InventoryResponse,
)
from app.services.base import BaseService


class InventoryService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.inventory = InventoryRepository(session)
        self.movements = InventoryMovementRepository(session)
        self.branches = BranchRepository(session)
        self.products = ProductRepository(session)

    def list(self, *, offset: int = 0, limit: int = 100) -> list[InventoryResponse]:
        return [
            InventoryResponse.model_validate(item)
            for item in self.inventory.list(offset=offset, limit=limit)
        ]

    def get(self, inventory_id: int) -> InventoryResponse:
        return InventoryResponse.model_validate(self._get_inventory(inventory_id))

    def create(self, data: InventoryCreate, *, user: str = "Sistema") -> InventoryResponse:
        self._require_branch_and_product(data.branch_id, data.product_id)
        if self.inventory.get_position(
            branch_id=data.branch_id,
            product_id=data.product_id,
        ) is not None:
            raise ResourceConflictError(
                "Ya existe inventario para ese producto en la sucursal indicada."
            )

        item = Inventory(
            branch_id=data.branch_id,
            product_id=data.product_id,
            quantity=data.stock,
        )
        with self.transaction():
            self.inventory.add(item)
            self.movements.add(
                InventoryMovement(
                    inventory=item,
                    movement_type=MovementType.INPUT.value,
                    quantity=data.stock,
                    previous_stock=0,
                    new_stock=data.stock,
                    reason="Inventario inicial",
                    user=user,
                )
            )
        return InventoryResponse.model_validate(item)

    def adjust(
        self,
        inventory_id: int,
        data: InventoryAdjustment,
        *,
        user: str,
    ) -> InventoryResponse:
        item = self._get_inventory(inventory_id)
        previous_stock = item.quantity
        with self.transaction():
            self.inventory.update(item, {"quantity": data.stock})
            self.movements.add(
                InventoryMovement(
                    inventory=item,
                    movement_type=MovementType.ADJUSTMENT.value,
                    quantity=abs(data.stock - previous_stock),
                    previous_stock=previous_stock,
                    new_stock=data.stock,
                    reason=data.reason,
                    user=user,
                )
            )
        return InventoryResponse.model_validate(item)

    def list_movements(
        self,
        *,
        inventory_id: int | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[InventoryMovementResponse]:
        records = (
            self.movements.list_by_inventory(inventory_id)
            if inventory_id is not None
            else self.movements.list_recent(offset=offset, limit=limit)
        )
        return [InventoryMovementResponse.model_validate(record) for record in records]

    def _get_inventory(self, inventory_id: int) -> Inventory:
        item = self.inventory.get_by_id(inventory_id)
        if item is None:
            raise ResourceNotFoundError("El registro de inventario no existe.")
        return item

    def _require_branch_and_product(self, branch_id: int, product_id: int) -> None:
        if self.branches.get_by_id(branch_id) is None:
            raise ResourceNotFoundError("La sucursal indicada no existe.")
        if self.products.get_by_id(product_id) is None:
            raise ResourceNotFoundError("El producto indicado no existe.")
