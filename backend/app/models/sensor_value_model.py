from tortoise import fields
from tortoise.models import Model


class SensorValue(Model):
    id = fields.IntField(pk=True)
    sensor = fields.ForeignKeyField("models.Sensor", related_name="sensor_values")
    value = fields.IntField()
    timestamp = fields.DatetimeField(auto_now_add=True)
