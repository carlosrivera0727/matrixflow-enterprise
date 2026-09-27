from datetime import datetime, timezone

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Matrix(Base):
    __tablename__ = "matrices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    value_records = relationship(
        "MatrixValue",
        back_populates="matrix",
        cascade="all, delete-orphan",
    )

    @property
    def values(self) -> list[list[float]]:
        if not self.value_records:
            return []

        row_count = max(record.row_index for record in self.value_records) + 1
        column_count = max(record.column_index for record in self.value_records) + 1
        result = [[0.0 for _ in range(column_count)] for _ in range(row_count)]
        for record in self.value_records:
            result[record.row_index][record.column_index] = record.value
        return result
