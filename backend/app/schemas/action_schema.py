from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.action_model import Action
from pydantic import BaseModel

ActionResponseSchema = pydantic_model_creator(
    Action, name="ActionResponseSchema", exclude=("automation", "triggers")
)

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
