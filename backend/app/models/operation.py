from datetime import datetime, timezone

from sqlalchemy import DateTime, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Operation(Base):
    __tablename__ = "operations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    category: Mapped[str] = mapped_column(String(20), nullable=False)

    operation_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    inputs: Mapped[str] = mapped_column(String(255), nullable=False)
    result: Mapped[object] = mapped_column(JSON, nullable=False)
    user: Mapped[str] = mapped_column(String(150), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Completada",
    )
