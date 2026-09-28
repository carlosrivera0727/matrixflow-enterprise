from __future__ import annotations

import numpy as np

from app.algorithms.types import MatrixInput, MatrixResult
from app.algorithms.validators import (
    validate_dimensions,
    validate_matrix,
    validate_scalar,
)


def add_matrix(left: MatrixInput, right: MatrixInput) -> MatrixResult:
    left_matrix = validate_matrix(left)
    right_matrix = validate_matrix(right)
    validate_dimensions(left_matrix, right_matrix)
    return np.add(left_matrix, right_matrix).tolist()


def subtract_matrix(left: MatrixInput, right: MatrixInput) -> MatrixResult:
    left_matrix = validate_matrix(left)
    right_matrix = validate_matrix(right)
    validate_dimensions(left_matrix, right_matrix)
    return np.subtract(left_matrix, right_matrix).tolist()


def multiply_matrix(left: MatrixInput, right: MatrixInput) -> MatrixResult:
    left_matrix = validate_matrix(left)
    right_matrix = validate_matrix(right)
    validate_dimensions(left_matrix, right_matrix, rule="matrix_multiplication")
    return np.matmul(left_matrix, right_matrix).tolist()


def transpose_matrix(matrix: MatrixInput) -> MatrixResult:
    validated_matrix = validate_matrix(matrix)
    return np.transpose(validated_matrix).tolist()


def scalar_multiply_matrix(matrix: MatrixInput, scalar: float) -> MatrixResult:
    validated_matrix = validate_matrix(matrix)
    validated_scalar = validate_scalar(scalar)
    return np.multiply(validated_matrix, validated_scalar).tolist()

