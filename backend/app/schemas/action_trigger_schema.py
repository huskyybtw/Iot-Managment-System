from pydantic import BaseModel
from app.common.examples import ACTION_TRIGGER_EXAMPLE
from app.schemas.action_schema import ActionResponseSchema


class ActionTriggerResponseSchema(BaseModel):
    id: int
    timestamp: str

    action: ActionResponseSchema
    model_config = {"json_schema_extra": {"example": ACTION_TRIGGER_EXAMPLE}}


class ActionTriggerCreateSchema(BaseModel):
    action: int

    model_config = {"json_schema_extra": {"example": ACTION_TRIGGER_EXAMPLE}}
