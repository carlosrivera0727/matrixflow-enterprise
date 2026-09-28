from __future__ import annotations

import numpy as np

from app.algorithms.types import VectorInput, VectorResult
from app.algorithms.validators import (
    validate_dimensions,
    validate_scalar,
    validate_vector,
)


def linear_combination(
    left: VectorInput,
    right: VectorInput,
    left_coefficient: float,
    right_coefficient: float,
) -> VectorResult:
    left_vector = validate_vector(left)
    right_vector = validate_vector(right)
    validate_dimensions(left_vector, right_vector)
    coefficient_a = validate_scalar(left_coefficient)
    coefficient_b = validate_scalar(right_coefficient)
    return np.add(
        np.multiply(left_vector, coefficient_a),
        np.multiply(right_vector, coefficient_b),
    ).tolist()

