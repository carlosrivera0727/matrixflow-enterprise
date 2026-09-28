from __future__ import annotations

import numpy as np

from app.algorithms.types import (
    MatrixInput,
    MatrixResult,
    ScalarResult,
    VectorInput,
    VectorResult,
)


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

    def subtract_vectors(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> VectorResult:
        result = self._vector(left) - self._vector(right)
        return result.tolist()

    def dot_product(
        self,
        left: VectorInput,
        right: VectorInput,
    ) -> ScalarResult:
        result = np.dot(self._vector(left), self._vector(right))
        return float(result)

    def scale_vector(
        self,
        vector: VectorInput,
        scalar: float,
    ) -> VectorResult:
        result = self._vector(vector) * scalar
        return result.tolist()

    def linear_combination(
        self,
        left: VectorInput,
        right: VectorInput,
        left_coefficient: float,
        right_coefficient: float,
    ) -> VectorResult:
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

    def subtract_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
        result = self._matrix(left) - self._matrix(right)
        return result.tolist()

    def multiply_matrices(
        self,
        left: MatrixInput,
        right: MatrixInput,
    ) -> MatrixResult:
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