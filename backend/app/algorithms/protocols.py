from typing import Protocol, runtime_checkable

from app.algorithms.types import (
    MatrixInput,
    MatrixResult,
    ScalarResult,
    VectorInput,
    VectorResult,
)


@runtime_checkable
class LinearAlgebraEngine(Protocol):
    """Contract implemented by the NumPy mathematical engine."""

    def add_vectors(self, left: VectorInput, right: VectorInput) -> VectorResult: ...

    def subtract_vectors(self, left: VectorInput, right: VectorInput) -> VectorResult: ...

    def dot_product(self, left: VectorInput, right: VectorInput) -> ScalarResult: ...

    def scale_vector(self, vector: VectorInput, scalar: float) -> VectorResult: ...

    def linear_combination(
        self,
        left: VectorInput,
        right: VectorInput,
        left_coefficient: float,
        right_coefficient: float,
    ) -> VectorResult: ...

    def add_matrices(self, left: MatrixInput, right: MatrixInput) -> MatrixResult: ...

    def subtract_matrices(self, left: MatrixInput, right: MatrixInput) -> MatrixResult: ...

    def multiply_matrices(self, left: MatrixInput, right: MatrixInput) -> MatrixResult: ...

    def transpose_matrix(self, matrix: MatrixInput) -> MatrixResult: ...

    def scale_matrix(self, matrix: MatrixInput, scalar: float) -> MatrixResult: ...
