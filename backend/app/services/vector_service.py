from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundError
from app.models.vector import Vector
from app.models.vector_value import VectorValue
from app.repositories.vector_repository import VectorRepository
from app.schemas.vector import VectorCreate, VectorResponse, VectorUpdate
from app.services.base import BaseService


class VectorService(BaseService):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.vectors = VectorRepository(session)

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[VectorResponse]:
        return [
            self._response(vector)
            for vector in self.vectors.list(
                offset=offset,
                limit=limit,
            )
        ]

    def get(self, vector_id: int) -> VectorResponse:
        vector = self._get_vector(vector_id)
        return self._response(vector)

    def create(self, data: VectorCreate) -> VectorResponse:
        vector = Vector(
            name=data.name,
            description=data.description,
            value_records=self._value_records(data.values),
        )

        with self.transaction():
            self.vectors.add(vector)

        return self._response(vector)

    def update(
        self,
        vector_id: int,
        data: VectorUpdate,
    ) -> VectorResponse:
        vector = self._get_vector(vector_id)

        values = data.model_dump(exclude_unset=True)
        vector_values = values.pop("values", None)

        with self.transaction():
            if vector_values is not None:
                self.vectors.replace_values(
                    vector,
                    self._value_records(vector_values),
                )

            self.vectors.update(vector, values)

        return self._response(vector)

    def delete(self, vector_id: int) -> None:
        vector = self._get_vector(vector_id)

        with self.transaction():
            self.vectors.delete(vector)

    def _get_vector(self, vector_id: int) -> Vector:
        vector = self.vectors.get_by_id(vector_id)

        if vector is None:
            raise ResourceNotFoundError(
                "El vector solicitado no existe."
            )

        return vector

    @staticmethod
    def _value_records(values: list[float]) -> list[VectorValue]:
        return [
            VectorValue(
                position=index,
                value=value,
            )
            for index, value in enumerate(values)
        ]

    @staticmethod
    def _response(vector: Vector) -> VectorResponse:
        return VectorResponse(
            id=vector.id,
            name=vector.name,
            description=vector.description or "",
            values=vector.values,
            created_at=vector.created_at,
        )