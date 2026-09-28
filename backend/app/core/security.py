from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from pydantic import ValidationError

from app.core.config import settings
from app.core.exceptions import InvalidTokenError
from app.schemas.auth import TokenPayload
from app.schemas.common import UserRole


_password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a password with the recommended Argon2 configuration."""

    return _password_hash.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Compare a password without exposing its stored hash."""

    try:
        return _password_hash.verify(password, password_hash)
    except Exception:
        return False


def create_access_token(
    *,
    user_id: int,
    email: str,
    role: UserRole | str,
    expires_delta: timedelta | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    expires_at = now + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.access_token_expire_minutes)
    )
    role_value = role.value if isinstance(role, UserRole) else role
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role_value,
        "type": "access",
        "iat": now,
        "exp": expires_at,
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
    }
    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
            issuer=settings.jwt_issuer,
            audience=settings.jwt_audience,
            options={
                "require": [
                    "sub",
                    "email",
                    "role",
                    "type",
                    "iat",
                    "exp",
                    "iss",
                    "aud",
                ],
            },
        )
        return TokenPayload.model_validate(payload)
    except (jwt.PyJWTError, ValidationError) as exc:
        raise InvalidTokenError("El token de acceso no es válido o ha expirado.") from exc
