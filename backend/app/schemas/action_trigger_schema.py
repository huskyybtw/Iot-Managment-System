from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.action_trigger_model import ActionTrigger

ActionTriggerResponseSchema = pydantic_model_creator(
    ActionTrigger,
    name="ActionTriggerResponseSchema",
    exclude=(
        "id",
        "action_id",
        "action",
    ),
)
ActionTriggerCreateSchema = pydantic_model_creator(
    ActionTrigger, name="ActionTriggerCreateSchema", exclude_readonly=True
)
