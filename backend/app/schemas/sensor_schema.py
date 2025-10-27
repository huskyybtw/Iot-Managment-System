from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.sensor_model import Sensor

SensorResponse = pydantic_model_creator(Sensor, name="SensorResponse")
SensorCreate = pydantic_model_creator(
    Sensor, name="SensorCreate", exclude_readonly=True
)
