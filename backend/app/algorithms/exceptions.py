class AlgorithmError(ValueError):
    """Base error for invalid mathematical operations."""


class InvalidOperandError(AlgorithmError):
    """Raised when an operand is empty or malformed."""


class DimensionMismatchError(AlgorithmError):
    """Raised when vector or matrix dimensions are incompatible."""
