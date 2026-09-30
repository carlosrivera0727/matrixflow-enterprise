<<<<<<< HEAD
from fastapi import APIRouter, Query, status
=======
from fastapi import APIRouter, Query
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0

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
<<<<<<< HEAD
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Operandos inválidos o dimensiones incompatibles."
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "El vector o la matriz solicitada no existe."
        },
    },
=======
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0
)
def create_operation(
    data: OperationCreate,
    session: DatabaseSession,
    current_user: BusinessUser,
) -> OperationResponse:
<<<<<<< HEAD
    return OperationService(session).execute(data, user=current_user.name)
=======
    return OperationService(session).execute(
        data,
        user=current_user.email,
    )
>>>>>>> a3bdb946e7309fc5cda1a737c60fcd5061e2a0f0


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