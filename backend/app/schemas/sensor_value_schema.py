from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.sensor_value_model import SensorValue

SensorValueResponse = pydantic_model_creator(SensorValue, name="SensorValueResponse")
SensorValueCreate = pydantic_model_creator(
    SensorValue, name="SensorValueCreate", exclude_readonly=True
)
