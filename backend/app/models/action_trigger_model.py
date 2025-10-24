from tortoise import fields, models


class ActionTrigger(models.Model):
    id = fields.IntField(pk=True)
    timestamp = fields.DatetimeField(auto_now_add=True)

    action = fields.ForeignKeyField("models.Action", related_name="triggers")
