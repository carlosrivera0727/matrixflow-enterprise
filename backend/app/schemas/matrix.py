from pydantic import BaseModel


class MatrixCreate(BaseModel):
    name: str
    values: list[list[float]]


class MatrixResponse(BaseModel):
    id: int
    name: str
    values: list[list[float]]