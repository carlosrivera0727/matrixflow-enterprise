from app.schemas.auth import LoginRequest


def login_user(data: LoginRequest):
    return {
        "status": "ok",
        "message": "Servicio de login preparado",
        "username": data.username,
    }