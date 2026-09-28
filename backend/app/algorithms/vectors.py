from __future__ import annotations

import numpy as np

from app.algorithms.types import ScalarResult, VectorInput, VectorResult
from app.algorithms.validators import (
    validate_dimensions,
    validate_scalar,
    validate_vector,
)


def sum_vector(left: VectorInput, right: VectorInput) -> VectorResult:
    left_vector = validate_vector(left)
    right_vector = validate_vector(right)
    validate_dimensions(left_vector, right_vector)
    return np.add(left_vector, right_vector).tolist()


def subtract_vector(left: VectorInput, right: VectorInput) -> VectorResult:
    left_vector = validate_vector(left)
    right_vector = validate_vector(right)
    validate_dimensions(left_vector, right_vector)
    return np.subtract(left_vector, right_vector).tolist()


def scalar_multiply(vector: VectorInput, scalar: float) -> VectorResult:
    validated_vector = validate_vector(vector)
    validated_scalar = validate_scalar(scalar)
    return np.multiply(validated_vector, validated_scalar).tolist()


def dot_product(left: VectorInput, right: VectorInput) -> ScalarResult:
    left_vector = validate_vector(left)
    right_vector = validate_vector(right)
    validate_dimensions(left_vector, right_vector)
    return float(np.dot(left_vector, right_vector))

