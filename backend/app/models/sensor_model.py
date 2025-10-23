from tortoise import fields
from tortoise.models import Model
from enum import Enum


class SensorType(str, Enum):
    OTHER = "other"


class Sensor(Model):
    id = fields.IntField(pk=True)
    label = fields.CharField(max_length=255, null=True)
    pin_id = fields.JSONField()
    range_min = fields.IntField()
    range_max = fields.IntField()
    type = fields.CharEnumField(enum_type=SensorType, max_length=32)
    in_out = fields.BooleanField()
    device = fields.ForeignKeyField("models.Device", related_name="sensors", null=True)
    sensor_values = fields.ReverseRelation["SensorValue"]
