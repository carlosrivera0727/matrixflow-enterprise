from typing import Literal

from pydantic import AliasChoices, EmailStr, Field

from app.schemas.common import APIModel, PositiveId, UserRole


class LoginRequest(APIModel):
    email: EmailStr = Field(validation_alias=AliasChoices("email", "username"))
    password: str = Field(min_length=6, max_length=128)


class AuthenticatedUser(APIModel):
    id: PositiveId
    name: str = Field(min_length=3, max_length=150)
    email: EmailStr
    role: UserRole


class LoginResponse(APIModel):
    access_token: str = Field(min_length=1)
    token_type: Literal["bearer"] = "bearer"
    user: AuthenticatedUser
