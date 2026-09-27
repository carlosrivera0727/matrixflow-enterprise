from sqlalchemy import Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class MatrixValue(Base):
    __tablename__ = "matrix_values"
    __table_args__ = (
        UniqueConstraint(
            "matrix_id",
            "row_index",
            "column_index",
            name="uq_matrix_position",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    matrix_id: Mapped[int] = mapped_column(
        ForeignKey("matrices.id"),
        nullable=False,
    )

    row_index: Mapped[int] = mapped_column(
        nullable=False,
    )

    column_index: Mapped[int] = mapped_column(
        nullable=False,
    )

    value: Mapped[float] = mapped_column(Float, nullable=False)

    matrix = relationship("Matrix", back_populates="value_records")
