from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.device_model import Device

DeviceResponse = pydantic_model_creator(Device, name="DeviceResponse")
DeviceUpdate = pydantic_model_creator(
    Device, name="DeviceUpdate", exclude_readonly=True
)
