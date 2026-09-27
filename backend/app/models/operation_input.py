from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class OperationInput(Base):
    __tablename__ = "operation_inputs"

    id: Mapped[int] = mapped_column(primary_key=True)

    operation_id: Mapped[int] = mapped_column(
        ForeignKey("operations.id"),
        nullable=False,
    )

    input_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    input_id: Mapped[int] = mapped_column(
        nullable=False,
    )

    operation = relationship("Operation")