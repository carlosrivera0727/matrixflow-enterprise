from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.inventory_movement import InventoryMovement
from app.repositories.base import BaseRepository


class InventoryRepository(BaseRepository[Inventory]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Inventory)

    def get_position(self, *, branch_id: int, product_id: int) -> Inventory | None:
        statement = select(Inventory).where(
            Inventory.branch_id == branch_id,
            Inventory.product_id == product_id,
        )
        return self.session.scalar(statement)


class InventoryMovementRepository(BaseRepository[InventoryMovement]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, InventoryMovement)

    def list_by_inventory(self, inventory_id: int) -> Sequence[InventoryMovement]:
        statement = (
            select(InventoryMovement)
            .where(InventoryMovement.inventory_id == inventory_id)
            .order_by(InventoryMovement.movement_date.desc())
        )
        return self.session.scalars(statement).all()
