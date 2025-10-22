from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=32, unique=True)
    password = fields.CharField(max_length=128)
    email = fields.CharField(max_length=128, unique=True)
    phone_number = fields.CharField(max_length=9, unique=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
