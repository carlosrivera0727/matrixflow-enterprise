from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.errors import register_exception_handlers
from app.api.router import api_router
from app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API empresarial para análisis de ventas, inventario y álgebra lineal.",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "MatrixFlow Enterprise API funcionando correctamente",
        "version": settings.app_version,
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "matrixflow-api",
    }
