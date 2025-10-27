from tortoise import fields, Model
from enum import Enum


class ConditionType(str, Enum):
    LT = "lt"
    GT = "gt"
    EQ = "eq"


class Automation(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    on_value = fields.IntField()
    condition = fields.CharEnumField(enum_type=ConditionType, max_length=2)

    user = fields.ForeignKeyField("models.User", related_name="automations")
    sensor = fields.ForeignKeyField("models.Sensor", related_name="automations")
    actions = fields.ReverseRelation["Action"]
