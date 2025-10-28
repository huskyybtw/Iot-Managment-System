from fastapi import APIRouter, HTTPException, Depends
from app.models.automation_model import Automation
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.schemas.automation_schema import AutomationResponseSchema

router = APIRouter(prefix="/automation", tags=["automations"])


@router.get("/", response_model=AutomationResponseSchema)
async def automations(
    user=Depends(current_user), pagination: PaginationParams = Depends()
):
    query = Automation.filter(user=user).prefetch_related("actions")
    if pagination.search:
        query = query.filter(name__icontains=pagination.search)
    query = apply_pagination(query, pagination)
    return await AutomationResponseSchema.from_queryset(query)
