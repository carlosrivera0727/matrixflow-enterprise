from sqlalchemy import Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VectorValue(Base):
    __tablename__ = "vector_values"
    __table_args__ = (
        UniqueConstraint("vector_id", "position", name="uq_vector_position"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    vector_id: Mapped[int] = mapped_column(
        ForeignKey("vectors.id"),
        nullable=False,
    )

    position: Mapped[int] = mapped_column(
        nullable=False,
    )

    value: Mapped[float] = mapped_column(Float, nullable=False)

    vector = relationship("Vector", back_populates="value_records")
