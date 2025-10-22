from tortoise.contrib.pydantic import pydantic_model_creator
from app.models import User

UserSchema = pydantic_model_creator(User, name="User", exclude_readonly=True)

UserCreateSchema = pydantic_model_creator(
    User, name="UserCreateDto", exclude=[User.created_at, User.updated_at, User.id]
)
