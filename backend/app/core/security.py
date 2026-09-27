from pwdlib import PasswordHash


_password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a password with the recommended Argon2 configuration."""

    return _password_hash.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Compare a password without exposing its stored hash."""

    return _password_hash.verify(password, password_hash)
