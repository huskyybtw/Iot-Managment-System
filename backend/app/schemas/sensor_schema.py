from pydantic import BaseModel
from app.common.examples import SENSOR_EXAMPLE, SENSOR_CREATE_EXAMPLE


class SensorResponse(BaseModel):
    id: int
    label: str
    pin_id: dict
    range_min: int
    range_max: int
    type: str
    in_out: bool

    model_config = {"json_schema_extra": {"example": SENSOR_EXAMPLE}}


class SensorCreate(BaseModel):
    label: str
    pin_id: dict
    range_min: int
    range_max: int
    type: str
    in_out: bool

    model_config = {"json_schema_extra": {"example": SENSOR_CREATE_EXAMPLE}}
