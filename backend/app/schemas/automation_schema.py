from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.automation_model import Automation

AutomationResponseSchema = pydantic_model_creator(
    Automation,
    name="AutomationResponseSchema",
    exclude=("user", "sensor", "actions.triggers"),
)
AutomationCreateSchema = pydantic_model_creator(
    Automation,
    name="AutomationCreateSchema",
    exclude=(
        "user",
        "sensor",
        "actions.triggers",
    ),
)
