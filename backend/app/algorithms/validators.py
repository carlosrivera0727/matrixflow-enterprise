from __future__ import annotations

from typing import Literal, TypeAlias

import numpy as np
from numpy.typing import NDArray

from app.algorithms.exceptions import DimensionMismatchError, InvalidOperandError
from app.algorithms.types import MatrixInput, VectorInput


FloatArray: TypeAlias = NDArray[np.float64]
DimensionRule: TypeAlias = Literal["equal", "matrix_multiplication"]


def validate_vector(values: VectorInput) -> FloatArray:
    """Return a finite, non-empty, one-dimensional NumPy vector."""

    try:
        vector = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise InvalidOperandError("El vector contiene valores no numéricos.") from exc

    if vector.ndim != 1 or vector.size == 0:
        raise InvalidOperandError(
            "El vector debe ser unidimensional y contener al menos un valor."
        )
    if not np.isfinite(vector).all():
        raise InvalidOperandError("El vector contiene valores no finitos.")
    return vector


def validate_matrix(values: MatrixInput) -> FloatArray:
    """Return a finite, non-empty, rectangular two-dimensional matrix."""

    try:
        matrix = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise InvalidOperandError(
            "La matriz debe ser rectangular y contener valores numéricos."
        ) from exc

    if matrix.ndim != 2 or matrix.size == 0 or 0 in matrix.shape:
        raise InvalidOperandError(
            "La matriz debe ser bidimensional, rectangular y no estar vacía."
        )
    if not np.isfinite(matrix).all():
        raise InvalidOperandError("La matriz contiene valores no finitos.")
    return matrix


def validate_scalar(value: float) -> float:
    try:
        scalar = float(value)
    except (TypeError, ValueError) as exc:
        raise InvalidOperandError("El escalar debe ser numérico.") from exc
    if not np.isfinite(scalar):
        raise InvalidOperandError("El escalar debe ser un número finito.")
    return scalar


def validate_dimensions(
    left: FloatArray,
    right: FloatArray,
    *,
    rule: DimensionRule = "equal",
) -> None:
    """Validate equal shapes or compatibility for matrix multiplication."""

    if rule == "equal":
        if left.shape != right.shape:
            raise DimensionMismatchError(
                "Los operandos deben tener las mismas dimensiones."
            )
        return

    if left.ndim != 2 or right.ndim != 2 or left.shape[1] != right.shape[0]:
        raise DimensionMismatchError(
            "Las columnas de la primera matriz deben coincidir con las filas "
            "de la segunda."
        )

