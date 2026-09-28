"""Pure mathematical contracts and implementations.

This package must not import FastAPI, SQLAlchemy, schemas, repositories or
services. It receives numeric operands and returns numeric results.
"""

from app.algorithms.exceptions import (
    AlgorithmError,
    DimensionMismatchError,
    InvalidOperandError,
)
from app.algorithms.linear_algebra import linear_combination
from app.algorithms.matrices import (
    add_matrix,
    multiply_matrix,
    scalar_multiply_matrix,
    subtract_matrix,
    transpose_matrix,
)
from app.algorithms.numpy_engine import NumPyLinearAlgebraEngine
from app.algorithms.protocols import LinearAlgebraEngine
from app.algorithms.types import MatrixInput, MatrixResult, VectorInput, VectorResult
from app.algorithms.validators import validate_dimensions, validate_matrix, validate_vector
from app.algorithms.vectors import (
    dot_product,
    scalar_multiply,
    subtract_vector,
    sum_vector,
)

__all__ = [
    "AlgorithmError",
    "DimensionMismatchError",
    "InvalidOperandError",
    "LinearAlgebraEngine",
    "NumPyLinearAlgebraEngine",
    "MatrixInput",
    "MatrixResult",
    "VectorInput",
    "VectorResult",
    "add_matrix",
    "dot_product",
    "linear_combination",
    "multiply_matrix",
    "scalar_multiply",
    "scalar_multiply_matrix",
    "subtract_matrix",
    "subtract_vector",
    "sum_vector",
    "transpose_matrix",
    "validate_dimensions",
    "validate_matrix",
    "validate_vector",
]
