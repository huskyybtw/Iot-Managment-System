from app.models import User
from pydantic import BaseModel, EmailStr


class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str
    phone_number: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "marek@example.com",
                "phone_number": "123456789",
                "password": "strongpassword",
            }
        }
    }


class UserResponseSchema(UserCreateSchema):
    id: int
    created_at: str
    updated_at: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "email": "marek@example.com",
                "phone_number": "123456789",
                "created_at": "2025-10-22T12:00:00",
                "updated_at": "2025-10-22T12:00:00",
                "password": "strongpassword",
            }
        }
    }


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

    model_config = {
        "json_schema_extra": {
            "example": {
                "user": {
                    "id": 1,
                    "email": "marek@example.com",
                    "phone_number": "123456789",
                    "created_at": "2025-10-22T12:00:00",
                    "updated_at": "2025-10-22T12:00:00",
                    "password": "strongpassword",
                },
                "access_token": "your.jwt.token",
            }
        }
    }
