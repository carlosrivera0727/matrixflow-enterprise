from fastapi import FastAPI

from app.core.config import settings

from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.companies import router as companies_router
from app.api.routes.branches import router as branches_router
from app.api.routes.products import router as products_router
from app.api.routes.sales import router as sales_router
from app.api.routes.inventory import router as inventory_router
from app.api.routes.vectors import router as vectors_router
from app.api.routes.matrices import router as matrices_router
from app.api.routes.operations import router as operations_router
from app.api.routes.reports import router as reports_router


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API empresarial para análisis de ventas, inventario y álgebra lineal.",
)


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(companies_router)
app.include_router(branches_router)
app.include_router(products_router)
app.include_router(sales_router)
app.include_router(inventory_router)
app.include_router(vectors_router)
app.include_router(matrices_router)
app.include_router(operations_router)
app.include_router(reports_router)


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