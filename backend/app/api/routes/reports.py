from fastapi import APIRouter

from app.api.dependencies import DatabaseSession, ReportUser
from app.schemas.report import ReportResponse
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("", response_model=ReportResponse)
def get_reports(
    session: DatabaseSession,
    _current_user: ReportUser,
) -> ReportResponse:
    return ReportService(session).get_dashboard()
