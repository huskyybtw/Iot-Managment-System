from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.device_model import Device
from app.schemas.sensor_schema import SensorCreate, SensorResponse

BaseDeviceResponse = pydantic_model_creator(
    Device,
    name="DeviceResponse",
    exclude=("user", "sensors"),
)


class DeviceResponse(BaseDeviceResponse):
    sensors: list[SensorResponse]


BaseDeviceCreate = pydantic_model_creator(
    Device,
    name="DeviceCreate",
    exclude=(
        "id",
        "label",
        "user_id",
        "user",
        "sensors",
    ),
)


class DeviceCreate(BaseDeviceCreate):
    sensors: list[SensorCreate]


DeviceAttach = pydantic_model_creator(
    Device,
    name="DeviceAttach",
    exclude_readonly=True,
    exclude=("user", "user_id", "mac_address", "sensors"),
)

DeviceUpdate = pydantic_model_creator(
    Device,
    name="DeviceUpdate",
    exclude_readonly=True,
    exclude=(
        "user_id",
        "mac_address",
        "sensors",
    ),
)
