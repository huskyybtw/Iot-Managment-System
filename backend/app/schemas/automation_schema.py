from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.automation_model import Automation
from app.schemas.action_schema import ActionCreateSchema, ActionResponseSchema

BaseAutomationResponseSchema = pydantic_model_creator(
    Automation,
    name="AutomationResponseSchema",
    exclude=("user", "sensor", "actions.triggers", "actions.automation"),
)


class AutomationResponseSchema(BaseAutomationResponseSchema):
    actions: list[ActionResponseSchema]


BaseAutomationCreateSchema = pydantic_model_creator(
    Automation,
    name="AutomationCreateSchema",
    exclude=(
        "id",
        "user",
        "sensor",
        "actions",
    ),
)


class AutomationCreateSchema(BaseAutomationCreateSchema):
    actions: list[ActionCreateSchema]
