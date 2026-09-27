from fastapi import APIRouter

from app.schemas.auth import LoginRequest
from app.services.auth_service import login_user


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Auth"],
)


@router.post("/login")
def login(data: LoginRequest):
    return login_user(data)