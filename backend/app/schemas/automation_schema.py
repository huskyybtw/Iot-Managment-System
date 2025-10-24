from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from app.schemas.action_schema import ActionResponseSchema, ActionCreateSchema
from app.common.examples import AUTOMATION_EXAMPLE


class ConditionType(str, Enum):
    LT = "lt"
    GT = "gt"
    EQ = "eq"


class AutomationResponseSchema(BaseModel):
    id: int
    user: int
    name: str
    sensor: int
    on_value: int
    condition: str
    actions: List[ActionResponseSchema] = []

    model_config = {"json_schema_extra": {"example": AUTOMATION_EXAMPLE}}


class AutomationCreateSchema(BaseModel):
    name: str
    sensor: int
    on_value: int
    condition: ConditionType
    actions: List[ActionCreateSchema]

    model_config = {"json_schema_extra": {"example": AUTOMATION_EXAMPLE}}

# class AutomationUpdateSchema(ActionCreateSchema):
#     id: int
#     actions: List[ActionCreateSchema]
