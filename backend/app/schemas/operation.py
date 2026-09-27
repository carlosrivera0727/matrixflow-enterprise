from pydantic import BaseModel


class OperationCreate(BaseModel):
    operation_type: str
    input_data: list


class OperationResponse(BaseModel):
    id: int
    operation_type: str
    result: list