from __future__ import annotations

from app.algorithms.linear_algebra import linear_combination
from app.algorithms.matrices import (
    add_matrix,
    multiply_matrix,
    scalar_multiply_matrix,
    subtract_matrix,
    transpose_matrix,
)
from app.algorithms.types import (
    MatrixInput,
    MatrixResult,
    ScalarResult,
    VectorInput,
    VectorResult,
)
from app.algorithms.vectors import (
    dot_product,
    scalar_multiply,
    subtract_vector,
    sum_vector,
)


class NumPyLinearAlgebraEngine:
    """NumPy implementation of the reusable linear-algebra contract."""

    def add_vectors(self, left: VectorInput, right: VectorInput) -> VectorResult:
        return sum_vector(left, right)

    def subtract_vectors(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> VectorResult:
        return subtract_vector(left, right)

    def dot_product(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> ScalarResult:
        return dot_product(left, right)

    def scale_vector(self, vector: VectorInput, scalar: float) -> VectorResult:
        return scalar_multiply(vector, scalar)

    def linear_combination(
        self,
        left: VectorInput,
        right: VectorInput,
        left_coefficient: float,
        right_coefficient: float,
    ) -> VectorResult:
        return linear_combination(
            left,
            right,
            left_coefficient,
            right_coefficient,
        )

    def add_matrices(self, left: MatrixInput, right: MatrixInput) -> MatrixResult:
        return add_matrix(left, right)

    def subtract_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
        return subtract_matrix(left, right)

    def multiply_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
        return multiply_matrix(left, right)

    def transpose_matrix(self, matrix: MatrixInput) -> MatrixResult:
        return transpose_matrix(matrix)

    def scale_matrix(self, matrix: MatrixInput, scalar: float) -> MatrixResult:
        return scalar_multiply_matrix(matrix, scalar)

