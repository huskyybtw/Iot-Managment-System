from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.device_model import Device

DeviceResponse = pydantic_model_creator(
    Device,
    name="DeviceResponse",
    exclude=("user", "sensors.automations", "sensors.sensor_values"),
)

DeviceCreate = pydantic_model_creator(
    Device,
    name="DeviceCreate",
    exclude=(
        "id",
        "label",
        "user_id",
        "user",
        "sensors.automations",
        "sensors.sensor_values",
        "sensors.id",
        "sensors.device",
    ),
)

DeviceAttach = pydantic_model_creator(
    Device,
    name="DeviceAttach",
    exclude_readonly=True,
    exclude=("user", "user_id", "mac_address"),
)
DeviceUpdate = pydantic_model_creator(
    Device,
    name="DeviceUpdate",
    exclude_readonly=True,
    exclude=(
        "user_id",
        "mac_address",
    ),
)
