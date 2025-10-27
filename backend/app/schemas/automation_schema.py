from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.automation_model import Automation

AutomationResponseSchema = pydantic_model_creator(
    Automation, name="AutomationResponseSchema"
)
AutomationCreateSchema = pydantic_model_creator(
    Automation, name="AutomationCreateSchema", exclude_readonly=True
)
