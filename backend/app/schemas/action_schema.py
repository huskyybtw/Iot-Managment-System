from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.action_model import Action

ActionResponseSchema = pydantic_model_creator(
    Action, name="ActionResponseSchema", exclude=("automation", "triggers")
)
ActionCreateSchema = pydantic_model_creator(
    Action, name="ActionCreateSchema", exclude_readonly=True
)
