from sqlalchemy.orm import Session

from app.models.matrix import Matrix
from app.repositories.base import BaseRepository


class MatrixRepository(BaseRepository[Matrix]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Matrix)
