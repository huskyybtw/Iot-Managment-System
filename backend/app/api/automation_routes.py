from fastapi import APIRouter, HTTPException, Depends
from app.models.automation_model import Automation
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.models.action_model import Action
from app.schemas.automation_schema import (
    AutomationResponseSchema,
    AutomationCreateSchema,
)
from tortoise.transactions import in_transaction

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


@router.post("/", response_model=AutomationResponseSchema)
async def create(input: AutomationCreateSchema, user=Depends(current_user)):
    input_dict = input.model_dump(exclude={"actions"})
    actions_data = input.model_dump().get("actions", [])

    if not actions_data or len(actions_data) == 0:
        raise HTTPException(status_code=400, detail="At least one action is required")

    async with in_transaction() as connection:
        automation = await Automation.create(
            **input_dict, user=user, using_db=connection
        )

        for action_data in actions_data:
            await Action.create(
                **action_data, automation=automation, using_db=connection
            )

        automation = (
            await Automation.filter(id=automation.id)
            .prefetch_related("actions")
            .first()
        )
        return await AutomationResponseSchema.from_tortoise_orm(automation)
