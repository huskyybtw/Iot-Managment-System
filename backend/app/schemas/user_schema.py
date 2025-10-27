from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.user_model import User
from pydantic import BaseModel

UserResponseSchema = pydantic_model_creator(User, name="UserResponseSchema")
UserCreateSchema = pydantic_model_creator(
    User, name="UserCreateSchema", exclude_readonly=True
)
UserUpdateSchema = pydantic_model_creator(
    User,
    name="UserUpdateSchema",
    exclude=("id", "created_at", "updated_at", "phone_number"),
)


class AuthResponseSchema(BaseModel):
    user: UserResponseSchema
    access_token: str
