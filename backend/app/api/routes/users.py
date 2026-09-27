from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import AdministratorUser, DatabaseSession
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("", response_model=list[UserResponse])
def get_users(
    session: DatabaseSession,
    _current_user: AdministratorUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[UserResponse]:
    return UserService(session).list(offset=offset, limit=limit)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    data: UserCreate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> UserResponse:
    return UserService(session).create(data)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> UserResponse:
    return UserService(session).get(user_id)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: UserUpdate,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> UserResponse:
    return UserService(session).update(user_id, data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    session: DatabaseSession,
    _current_user: AdministratorUser,
) -> Response:
    UserService(session).delete(user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
