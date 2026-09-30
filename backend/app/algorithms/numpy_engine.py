from __future__ import annotations

<<<<<<< HEAD
from app.algorithms.linear_algebra import linear_combination
from app.algorithms.matrices import (
    add_matrix,
    multiply_matrix,
    scalar_multiply_matrix,
    subtract_matrix,
    transpose_matrix,
)
=======
import numpy as np

>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0
from app.algorithms.types import (
    MatrixInput,
    MatrixResult,
    ScalarResult,
    VectorInput,
    VectorResult,
)
<<<<<<< HEAD
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
=======


class NumPyLinearAlgebraEngine:
    """Motor de álgebra lineal implementado con NumPy."""

    @staticmethod
    def _vector(values: VectorInput) -> np.ndarray:
        return np.asarray(values, dtype=float)

    @staticmethod
    def _matrix(values: MatrixInput) -> np.ndarray:
        return np.asarray(values, dtype=float)

    def add_vectors(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> VectorResult:
        result = self._vector(left) + self._vector(right)
        return result.tolist()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

    def subtract_vectors(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> VectorResult:
<<<<<<< HEAD
        return subtract_vector(left, right)
=======
        result = self._vector(left) - self._vector(right)
        return result.tolist()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

    def dot_product(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> ScalarResult:
<<<<<<< HEAD
        return dot_product(left, right)

    def scale_vector(self, vector: VectorInput, scalar: float) -> VectorResult:
        return scalar_multiply(vector, scalar)
=======
        result = np.dot(self._vector(left), self._vector(right))
        return float(result)

    def scale_vector(
        self,
        vector: VectorInput,
        scalar: float,
    ) -> VectorResult:
        result = self._vector(vector) * scalar
        return result.tolist()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

    def linear_combination(
        self,
        left: VectorInput,
        right: VectorInput,
        left_coefficient: float,
        right_coefficient: float,
    ) -> VectorResult:
<<<<<<< HEAD
        return linear_combination(
            left,
            right,
            left_coefficient,
            right_coefficient,
        )

    def add_matrices(self, left: MatrixInput, right: MatrixInput) -> MatrixResult:
        return add_matrix(left, right)
=======
        result = (
            left_coefficient * self._vector(left)
            + right_coefficient * self._vector(right)
        )
        return result.tolist()

    def add_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
        result = self._matrix(left) + self._matrix(right)
        return result.tolist()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

    def subtract_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
<<<<<<< HEAD
        return subtract_matrix(left, right)
=======
        result = self._matrix(left) - self._matrix(right)
        return result.tolist()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

    def multiply_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
<<<<<<< HEAD
        return multiply_matrix(left, right)

    def transpose_matrix(self, matrix: MatrixInput) -> MatrixResult:
        return transpose_matrix(matrix)

    def scale_matrix(self, matrix: MatrixInput, scalar: float) -> MatrixResult:
        return scalar_multiply_matrix(matrix, scalar)

=======
        result = self._matrix(left) @ self._matrix(right)
        return result.tolist()

    def transpose_matrix(
        self,
        matrix: MatrixInput,
    ) -> MatrixResult:
        result = self._matrix(matrix).T
        return result.tolist()

    def scale_matrix(
        self,
        matrix: MatrixInput,
        scalar: float,
    ) -> MatrixResult:
        result = self._matrix(matrix) * scalar
        return result.tolist()
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0
