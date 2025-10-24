from pydantic import BaseModel
from typing import Optional, List
from app.common.examples import ACTION_EXAMPLE
from enum import Enum
from app.schemas.action_trigger_schema import ActionTriggerResponseSchema


class ActionType(str, Enum):
    EMAIL = "email"
    SMS = "sms"


class ActionResponseSchema(BaseModel):
    id: int
    type: str
    target: str
    value: str
    automation: int
    triggers: List[ActionTriggerResponseSchema] = []

    model_config = {"json_schema_extra": {"example": ACTION_EXAMPLE}}


class ActionCreateSchema(BaseModel):
    type: str
    target: str
    value: str
    automation: int

    model_config = {"json_schema_extra": {"example": ACTION_EXAMPLE}}
