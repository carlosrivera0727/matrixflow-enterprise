from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class OperationResult(Base):
    __tablename__ = "operation_results"

    id: Mapped[int] = mapped_column(primary_key=True)

    operation_id: Mapped[int] = mapped_column(
        ForeignKey("operations.id"),
        nullable=False,
    )

    result_value: Mapped[float] = mapped_column(
        nullable=False,
    )

    operation = relationship("Operation")