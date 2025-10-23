from app.models import Device
from app.schemas.user_schema import UserResponseSchema
from pydantic import BaseModel
from app.common.examples import DEVICE_EXAMPLE, DEVICE_UPDATE_EXAMPLE


class DeviceResponse(BaseModel):
    id: int
    label: str
    mac_address: str
    user: UserResponseSchema

    model_config = {"json_schema_extra": {"example": DEVICE_EXAMPLE}}


class DeviceUpdate(BaseModel):
    label: str

    model_config = {"json_schema_extra": {"example": DEVICE_UPDATE_EXAMPLE}}
