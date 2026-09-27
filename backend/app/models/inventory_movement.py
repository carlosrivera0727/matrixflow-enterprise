from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id: Mapped[int] = mapped_column(primary_key=True)

    inventory_id: Mapped[int] = mapped_column(
        ForeignKey("inventory.id"),
        nullable=False,
    )

    movement_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        nullable=False,
    )
    previous_stock: Mapped[int] = mapped_column(nullable=False)
    new_stock: Mapped[int] = mapped_column(nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    user: Mapped[str] = mapped_column(String(150), nullable=False)

    movement_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    inventory = relationship("Inventory", back_populates="movements")

    @property
    def type(self) -> str:
        return self.movement_type

    @property
    def branch_id(self) -> int:
        return self.inventory.branch_id

    @property
    def product_id(self) -> int:
        return self.inventory.product_id

    @property
    def created_at(self) -> datetime:
        return self.movement_date
