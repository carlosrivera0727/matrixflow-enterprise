from pydantic import BaseModel


class VectorCreate(BaseModel):
    name: str
    values: list[float]


class VectorResponse(BaseModel):
    id: int
    name: str
    values: list[float]