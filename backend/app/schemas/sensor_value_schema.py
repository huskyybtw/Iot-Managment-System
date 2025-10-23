from pydantic import BaseModel
from app.common.examples import SENSOR_VALUE_EXAMPLE, SENSOR_VALUE_CREATE_EXAMPLE


class SensorValueResponse(BaseModel):
    id: int
    sensor: int
    value: int
    timestamp: str
    model_config = {"json_schema_extra": {"example": SENSOR_VALUE_EXAMPLE}}


class SensorValueCreate(BaseModel):
    sensor: int
    value: int
    model_config = {"json_schema_extra": {"example": SENSOR_VALUE_CREATE_EXAMPLE}}
