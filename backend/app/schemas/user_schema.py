from app.models import User
from pydantic import BaseModel, EmailStr
from app.common.examples import USER_EXAMPLE, USER_CREATE_EXAMPLE, AUTH_RESPONSE_EXAMPLE


class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str
    phone_number: str

    model_config = {"json_schema_extra": {"example": USER_CREATE_EXAMPLE}}


class UserResponseSchema(UserCreateSchema):
    id: int
    created_at: str
    updated_at: str

    model_config = {"json_schema_extra": {"example": USER_EXAMPLE}}


class AuthLoginSchema(BaseModel):
    email: EmailStr
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "marek@example.com",
                "password": "strongpassword",
            }
        }
    }


class AuthResponse(BaseModel):
    user: UserResponseSchema
    access_token: str

    model_config = {"json_schema_extra": {"example": AUTH_RESPONSE_EXAMPLE}}
