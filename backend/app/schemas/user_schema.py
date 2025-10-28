from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.user_model import User
from pydantic import BaseModel

UserResponseSchema = pydantic_model_creator(
    User, name="UserResponseSchema", exclude=("devices", "automations")
)
UserCreateSchema = pydantic_model_creator(
    User, name="UserCreateSchema", exclude_readonly=True, exclude=("automations")
)
UserLoginSchema = pydantic_model_creator(
    User,
    name="UserLoginSchema",
    exclude_readonly=True,
    exclude=("devices", "automations", "phone_number"),
)
UserUpdateSchema = pydantic_model_creator(
    User, name="UserCreateSchema", exclude_readonly=True, exclude=("automations")
)


class AuthResponseSchema(BaseModel):
    user: UserResponseSchema
    access_token: str
