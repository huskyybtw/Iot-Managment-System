from app.schemas.user_schema import (
    UserResponseSchema,
    UserCreateSchema,
    UserLoginSchema,
    UserUpdateSchema,
    AuthResponseSchema,
)
from app.models.user_model import User
from app.services.auth_service import create_access_token
from fastapi import APIRouter, HTTPException, Depends
from app.common.hash import hash_password, verify_password
from app.common.auth import current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponseSchema)
async def register(data: UserCreateSchema):
    existing = await User.filter(email=data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    data.password = hash_password(data.password)
    user = await User.create(**data.model_dump())
    user_response = await UserResponseSchema.from_tortoise_orm(user)
    token = create_access_token({"sub": user.email})
    return AuthResponseSchema(user=user_response, access_token=token)


@router.post("/login", response_model=AuthResponseSchema)
async def login(data: UserLoginSchema):
    user = await User.filter(email=data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_response = await UserResponseSchema.from_tortoise_orm(user)
    token = create_access_token({"sub": user.email})
    return AuthResponseSchema(user=user_response, access_token=token)


@router.get("/me", response_model=AuthResponseSchema)
async def me(user=Depends(current_user)):
    user_response = await UserResponseSchema.from_tortoise_orm(user)
    token = create_access_token({"sub": user.email})
    return AuthResponseSchema(user=user_response, access_token=token)


@router.patch("/me", response_model=AuthResponseSchema)
async def patch_me(data: UserUpdateSchema, user: User = Depends(current_user)):
    user.update_from_dict(data.model_dump(exclude_unset=True))
    user.password = hash_password(data.password)
    await user.save()
    user_response = await UserResponseSchema.from_tortoise_orm(user)
    token = create_access_token({"sub": user.email})
    return AuthResponseSchema(user=user_response, access_token=token)
