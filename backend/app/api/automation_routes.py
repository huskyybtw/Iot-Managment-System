from fastapi import APIRouter, HTTPException, Depends
from app.models.automation_model import Automation
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.models.action_model import Action
from app.models.action_trigger_model import ActionTrigger
from app.schemas.automation_schema import (
    AutomationResponseSchema,
    AutomationCreateSchema,
    AutomationUpdateSchema,
    AutomationWithTriggersSchema,
)
from app.schemas.action_schema import ActionResponseSchema
from app.schemas.action_trigger_schema import ActionTriggerResponseSchema
from tortoise.transactions import in_transaction
from datetime import datetime, timedelta

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


@router.get("/{id}", response_model=AutomationWithTriggersSchema)
async def get_automation(id: int, timeframe: int = 2592000, user=Depends(current_user)):
    automation = (
        await Automation.filter(id=id, user=user).prefetch_related("actions").first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")

    # Calculate time threshold
    time_threshold = datetime.now() - timedelta(seconds=timeframe)

    # Fetch actions with triggers within timeframe
    actions_with_triggers = []
    for action in automation.actions:
        # Fetch triggers for this action within timeframe
        triggers = await ActionTrigger.filter(
            action=action, timestamp__gte=time_threshold
        ).all()

        # Convert triggers to schema
        triggers_list = [
            await ActionTriggerResponseSchema.from_tortoise_orm(trigger)
            for trigger in triggers
        ]

        # Build action dict with triggers
        action_dict = await ActionResponseSchema.from_tortoise_orm(action)
        action_with_triggers = action_dict.model_dump()
        action_with_triggers["triggers"] = triggers_list
        actions_with_triggers.append(action_with_triggers)

    # Build response
    automation_base = await AutomationResponseSchema.from_tortoise_orm(automation)
    automation_dict = automation_base.model_dump()
    automation_dict["actions"] = actions_with_triggers

    return automation_dict


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
