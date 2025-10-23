from pydantic import BaseModel
from typing import Type


class PaginationParams(BaseModel):
    page: int | None = 1
    per_page: int | None = 10
    offset: int | None = None
    search: str | None = None


class DeviceFilters(BaseModel):
    label: str | None = None
    mac_address: str | None = None


def apply_pagination(query, pagination: PaginationParams):
    offset = (
        pagination.offset
        if pagination.offset is not None
        else (pagination.page - 1) * pagination.per_page
    )
    query = query.offset(offset).limit(pagination.per_page)
    return query


def apply_filters(query, filter_cls: Type[BaseModel], filters: BaseModel):
    for field in filter_cls.model_fields:
        value = getattr(filters, field, None)
        if value is not None:
            query = query.filter(**{field: value})
    return query
