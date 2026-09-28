from datetime import datetime, timezone

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Vector(Base):
    __tablename__ = "vectors"

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
        "VectorValue",
        back_populates="vector",
        cascade="all, delete-orphan",
    )

    @property
    def values(self) -> list[float]:
        records = sorted(self.value_records, key=lambda record: record.position)
        return [record.value for record in records]
