from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.action_model import Action
from app.schemas.action_trigger_schema import ActionTriggerResponseSchema

ActionResponseSchema = pydantic_model_creator(
    Action,
    name="ActionResponseSchema",
    exclude=("automation_id", "automation", "triggers"),
)


class ActionWithTriggersSchema(ActionResponseSchema):
    triggers: list[ActionTriggerResponseSchema]


ActionCreateSchema = pydantic_model_creator(
    Action,
    name="ActionCreateSchema",
    exclude=("id", "automation_id", "automation", "triggers"),
)

ActionUpdateSchema = pydantic_model_creator(
    Action,
    name="ActionUpdateSchema",
    exclude=("automation_id", "automation", "triggers"),
)
