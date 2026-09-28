"""Pure mathematical contracts and implementations.

This package must not import FastAPI, SQLAlchemy, schemas, repositories or
services. It receives numeric operands and returns numeric results.
"""

from app.algorithms.exceptions import (
    AlgorithmError,
    DimensionMismatchError,
    InvalidOperandError,
)
from app.algorithms.protocols import LinearAlgebraEngine
from app.algorithms.types import MatrixInput, MatrixResult, VectorInput, VectorResult

__all__ = [
    "AlgorithmError",
    "DimensionMismatchError",
    "InvalidOperandError",
    "LinearAlgebraEngine",
    "MatrixInput",
    "MatrixResult",
    "VectorInput",
    "VectorResult",
]
