from fastapi import APIRouter, HTTPException, Depends
from app.models.automation_model import Automation
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.models.action_model import Action
from app.schemas.automation_schema import (
    AutomationResponseSchema,
    AutomationCreateSchema,
    AutomationUpdateSchema,
)
from tortoise.transactions import in_transaction

router = APIRouter(prefix="/automation", tags=["automations"])


@router.get("/", response_model=list[AutomationResponseSchema])
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
    if not input.actions or len(input.actions) == 0:
        raise HTTPException(status_code=400, detail="At least one action is required")

    async with in_transaction() as connection:
        input_dict = input.model_dump(exclude={"actions"})
        automation = await Automation.create(
            **input_dict, user=user, using_db=connection
        )

        for action in input.actions:
            action_dict = action.model_dump()
            await Action.create(
                **action_dict, automation=automation, using_db=connection
            )

        automation = (
            await Automation.filter(id=automation.id)
            .prefetch_related("actions")
            .first()
        )
        return await AutomationResponseSchema.from_tortoise_orm(automation)


@router.patch("/{id}", response_model=AutomationResponseSchema)
async def update(id: int, input: AutomationUpdateSchema, user=Depends(current_user)):
    automation = await Automation.filter(id=id, user=user).first()
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")

    if not input.actions and not input.new_actions:
        raise HTTPException(status_code=400, detail="At least one action is required")

    async with in_transaction() as connection:
        # Update automation fields
        input_dict = input.model_dump(
            exclude={"actions", "new_actions", "delete_actions"}
        )
        automation.update_from_dict(input_dict)
        await automation.save(using_db=connection)

        # Delete actions
        if input.delete_actions:
            await Action.filter(
                id__in=input.delete_actions, automation=automation
            ).using_db(connection).delete()

        # Update existing actions
        for action in input.actions:
            action_dict = action.model_dump(exclude={"id"})
            await Action.filter(id=action.id, automation=automation).using_db(
                connection
            ).update(**action_dict)

        # Create new actions
        if input.new_actions:
            for action in input.new_actions:
                action_dict = action.model_dump()
                await Action.create(
                    **action_dict, automation=automation, using_db=connection
                )

        automation = (
            await Automation.filter(id=automation.id)
            .prefetch_related("actions")
            .first()
        )
        return await AutomationResponseSchema.from_tortoise_orm(automation)


@router.delete("/{id}")
async def delete(id: int, user=Depends(current_user)):
    automation = (
        await Automation.filter(id=id, user=user).prefetch_related("actions").first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")

    async with in_transaction() as connection:
        await Action.filter(automation=automation).using_db(connection).delete()
        await automation.delete(using_db=connection)

    return {"message": "Automation deleted successfully"}
