from tortoise import fields, models
from app.schemas.action_schema import ActionType



class Action(models.Model):
    id = fields.IntField(pk=True)
    type = fields.CharEnumField(enum_type=ActionType, max_length=20)
    # Do przemyslenia, jak zrobic dokladnie target i value bo to bardzo zalezy od typu akcji
    target = fields.CharField(max_length=255)
    value = fields.CharField(max_length=255)

    automation = fields.ForeignKeyField("models.Automation", related_name="actions")
    triggers = fields.ReverseRelation["ActionTrigger"]
