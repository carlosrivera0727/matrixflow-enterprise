from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import BusinessUser, DatabaseSession
from app.schemas.matrix import MatrixCreate, MatrixResponse, MatrixUpdate
from app.services.matrix_service import MatrixService

router = APIRouter(
    prefix="/matrices",
    tags=["Matrices"],
)


@router.get("", response_model=list[MatrixResponse])
def get_matrices(
    session: DatabaseSession,
    _current_user: BusinessUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[MatrixResponse]:
    return MatrixService(session).list(offset=offset, limit=limit)


@router.post("", response_model=MatrixResponse, status_code=status.HTTP_201_CREATED)
def create_matrix(
    data: MatrixCreate,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> MatrixResponse:
    return MatrixService(session).create(data)


@router.get("/{matrix_id}", response_model=MatrixResponse)
def get_matrix(
    matrix_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> MatrixResponse:
    return MatrixService(session).get(matrix_id)


@router.patch("/{matrix_id}", response_model=MatrixResponse)
def update_matrix(
    matrix_id: int,
    data: MatrixUpdate,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> MatrixResponse:
    return MatrixService(session).update(matrix_id, data)


@router.delete("/{matrix_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_matrix(
    matrix_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> Response:
    MatrixService(session).delete(matrix_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
