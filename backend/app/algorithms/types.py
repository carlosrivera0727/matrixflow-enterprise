from collections.abc import Sequence
from typing import TypeAlias


VectorInput: TypeAlias = Sequence[float]
MatrixInput: TypeAlias = Sequence[Sequence[float]]
VectorResult: TypeAlias = list[float]
MatrixResult: TypeAlias = list[list[float]]
ScalarResult: TypeAlias = float
