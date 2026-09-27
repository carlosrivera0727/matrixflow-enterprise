from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VectorValue(Base):
    __tablename__ = "vector_values"

    id: Mapped[int] = mapped_column(primary_key=True)

    vector_id: Mapped[int] = mapped_column(
        ForeignKey("vectors.id"),
        nullable=False,
    )

    position: Mapped[int] = mapped_column(
        nullable=False,
    )

    value: Mapped[float] = mapped_column(
        nullable=False,
    )

    vector = relationship("Vector")