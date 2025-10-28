from tortoise import fields
from tortoise.models import Model


class Device(Model):
    id = fields.IntField(pk=True)
    label = fields.CharField(max_length=255, null=True)
    mac_address = fields.CharField(max_length=12, unique=True)

    user = fields.ForeignKeyField("models.User", related_name="devices", null=True)
    sensors = fields.ReverseRelation["Sensor"]
