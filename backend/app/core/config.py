from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
DEVELOPMENT_JWT_SECRETS = {
    "development-only-change-me-please-32",
    "change-this-secret-before-production",
}


class Settings(BaseSettings):
    app_name: str = "MatrixFlow Enterprise API"
    app_version: str = "1.0.0"
    environment: str = "development"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite:///./matrixflow.db"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )
    cors_allow_credentials: bool = True
    jwt_secret_key: str = Field(
        default="development-only-change-me-please-32",
        min_length=32,
    )
    jwt_algorithm: Literal["HS256", "HS384", "HS512"] = "HS256"
    jwt_issuer: str = "matrixflow-enterprise"
    jwt_audience: str = "matrixflow-frontend"
    access_token_expire_minutes: int = Field(default=60, gt=0, le=1440)

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @model_validator(mode="after")
    def reject_development_secret_in_production(self):
        if (
            self.environment.lower() == "production"
            and self.jwt_secret_key in DEVELOPMENT_JWT_SECRETS
        ):
            raise ValueError("JWT_SECRET_KEY debe cambiarse en producción.")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
