from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import BusinessUser, DatabaseSession
from app.schemas.vector import VectorCreate, VectorResponse, VectorUpdate
from app.services.vector_service import VectorService

router = APIRouter(
    prefix="/vectors",
    tags=["Vectors"],
)


@router.get("", response_model=list[VectorResponse])
def get_vectors(
    session: DatabaseSession,
    _current_user: BusinessUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[VectorResponse]:
    return VectorService(session).list(offset=offset, limit=limit)


@router.post("", response_model=VectorResponse, status_code=status.HTTP_201_CREATED)
def create_vector(
    data: VectorCreate,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> VectorResponse:
    return VectorService(session).create(data)


@router.get("/{vector_id}", response_model=VectorResponse)
def get_vector(
    vector_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> VectorResponse:
    return VectorService(session).get(vector_id)


@router.patch("/{vector_id}", response_model=VectorResponse)
def update_vector(
    vector_id: int,
    data: VectorUpdate,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> VectorResponse:
    return VectorService(session).update(vector_id, data)


@router.delete("/{vector_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vector(
    vector_id: int,
    session: DatabaseSession,
    _current_user: BusinessUser,
) -> Response:
    VectorService(session).delete(vector_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
