from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.sensor_model import Sensor
from app.schemas.sensor_value_schema import SensorValueResponse

SensorResponse = pydantic_model_creator(
    Sensor, name="SensorResponse", exclude=("device", "sensor_values", "automations")
)

SensorCreate = pydantic_model_creator(
    Sensor,
    name="SensorCreate",
    exclude=("id", "device", "sensor_values", "automations"),
)


class SensorWithValuesResponse(SensorResponse):
    sensor_values: list[SensorValueResponse]
