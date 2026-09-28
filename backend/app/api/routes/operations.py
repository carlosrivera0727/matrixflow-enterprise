from fastapi import APIRouter, Query

from app.api.dependencies import BusinessUser, DatabaseSession
from app.schemas.operation import OperationCreate, OperationResponse
from app.services.operation_service import OperationService


router = APIRouter(
    prefix="/operations",
    tags=["Operations"],
)


@router.post(
    "",
    response_model=OperationResponse,
)
def create_operation(
    data: OperationCreate,
    session: DatabaseSession,
    current_user: BusinessUser,
) -> OperationResponse:
    return OperationService(session).execute(
        data,
        user=current_user.email,
    )


@router.get("", response_model=list[OperationResponse])
def get_operations(
    session: DatabaseSession,
    _current_user: BusinessUser,
    limit: int = Query(default=100, ge=1, le=500),
) -> list[OperationResponse]:
    return OperationService(session).list(limit=limit)


@router.get("/{operation_id}", response_model=OperationResponse)
def get_operation(
    operation_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> OperationResponse:
    return OperationService(session).get(operation_id)