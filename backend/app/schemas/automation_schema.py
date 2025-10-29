from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.automation_model import Automation
from app.schemas.action_schema import (
    ActionCreateSchema,
    ActionResponseSchema,
    ActionUpdateSchema,
    ActionWithTriggersSchema,
)

BaseAutomationResponseSchema = pydantic_model_creator(
    Automation,
    name="AutomationResponseSchema",
    exclude=("user", "sensor", "actions.triggers", "actions.automation"),
)


class AutomationResponseSchema(BaseAutomationResponseSchema):
    actions: list[ActionResponseSchema]


class AutomationWithTriggersSchema(BaseAutomationResponseSchema):
    actions: list[ActionWithTriggersSchema]


BaseAutomationCreateSchema = pydantic_model_creator(
    Automation,
    name="AutomationCreateSchema",
    exclude=(
        "id",
        "user",
        "user_id",
        "sensor",
        "actions",
    ),
)


class AutomationCreateSchema(BaseAutomationCreateSchema):
    actions: list[ActionCreateSchema]


class AutomationUpdateSchema(BaseAutomationCreateSchema):
    actions: list[ActionUpdateSchema]
    new_actions: list[ActionCreateSchema]
    delete_actions: list[int] = []
