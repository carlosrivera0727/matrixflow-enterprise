from sqlalchemy.orm import Session

from app.models.vector import Vector
from app.repositories.base import BaseRepository


class VectorRepository(BaseRepository[Vector]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Vector)
