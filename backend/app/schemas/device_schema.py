from app.models import Device
from app.schemas.user_schema import UserResponseSchema
from pydantic import BaseModel
from app.common.examples import DEVICE_EXAMPLE


class DeviceResponse(BaseModel):
    id: int
    label: str
    mac_address: str
    user: UserResponseSchema

    model_config = {"json_schema_extra": {"example": DEVICE_EXAMPLE}}
