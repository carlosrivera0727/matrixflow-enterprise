import pytest

from app.algorithms import (
    DimensionMismatchError,
    InvalidOperandError,
    NumPyLinearAlgebraEngine,
    add_matrix,
    dot_product,
    linear_combination,
    multiply_matrix,
    scalar_multiply,
    scalar_multiply_matrix,
    subtract_matrix,
    subtract_vector,
    sum_vector,
    transpose_matrix,
    validate_matrix,
    validate_vector,
)
from app.algorithms.protocols import LinearAlgebraEngine


def test_vector_operations_use_numpy_and_return_native_values() -> None:
    assert sum_vector([1, 2, 3], [4, 5, 6]) == [5.0, 7.0, 9.0]
    assert subtract_vector([5, 4, 3], [1, 2, 3]) == [4.0, 2.0, 0.0]
    assert scalar_multiply([1, -2, 3], 2.5) == [2.5, -5.0, 7.5]
    assert dot_product([1, 2, 3], [4, 5, 6]) == 32.0
    assert linear_combination([1, 2], [3, 4], 2, -1) == [-1.0, 0.0]


def test_matrix_operations_use_numpy_and_return_native_values() -> None:
    left = [[1, 2], [3, 4]]
    right = [[5, 6], [7, 8]]

    assert add_matrix(left, right) == [[6.0, 8.0], [10.0, 12.0]]
    assert subtract_matrix(right, left) == [[4.0, 4.0], [4.0, 4.0]]
    assert multiply_matrix(left, right) == [[19.0, 22.0], [43.0, 50.0]]
    assert multiply_matrix(
        [[1, 2, 3], [4, 5, 6]],
        [[7, 8], [9, 10], [11, 12]],
    ) == [[58.0, 64.0], [139.0, 154.0]]
    assert transpose_matrix(left) == [[1.0, 3.0], [2.0, 4.0]]
    assert scalar_multiply_matrix(left, 0.5) == [[0.5, 1.0], [1.5, 2.0]]


def test_engine_implements_the_reusable_contract() -> None:
    engine = NumPyLinearAlgebraEngine()

    assert isinstance(engine, LinearAlgebraEngine)
    assert engine.dot_product([2, 3], [4, 5]) == 23.0
    assert engine.transpose_matrix([[1, 2, 3]]) == [[1.0], [2.0], [3.0]]


def test_dimension_validation_rejects_incompatible_operands() -> None:
    with pytest.raises(DimensionMismatchError, match="mismas dimensiones"):
        sum_vector([1, 2], [1, 2, 3])

    with pytest.raises(DimensionMismatchError, match="columnas"):
        multiply_matrix([[1, 2]], [[1, 2]])

    with pytest.raises(DimensionMismatchError, match="mismas dimensiones"):
        linear_combination([1, 2], [1], 1, 1)


def test_operand_validation_rejects_empty_irregular_and_non_finite_data() -> None:
    with pytest.raises(InvalidOperandError, match="vector"):
        validate_vector([])

    with pytest.raises(InvalidOperandError, match="rectangular"):
        validate_matrix([[1, 2], [3]])

    with pytest.raises(InvalidOperandError, match="no finitos"):
        validate_vector([1, float("nan")])

    with pytest.raises(InvalidOperandError, match="finito"):
        scalar_multiply([1, 2], float("inf"))
