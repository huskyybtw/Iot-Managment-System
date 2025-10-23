from app.schemas.user_schema import (
    UserResponseSchema,
    UserCreateSchema,
    AuthResponse,
    AuthLoginSchema,
)
from app.models.user_model import User
from app.services.auth_service import create_access_token
from fastapi import APIRouter, HTTPException, Depends
from app.common.hash import hash_password, verify_password
from app.common.mapper import serialize, deserialize
from app.common.auth import current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(data: UserCreateSchema):
    existing = await User.filter(email=data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    data.password = hash_password(data.password)
    user = await User.create(**deserialize(data))
    user_response = serialize(UserResponseSchema, user)
    token = create_access_token({"sub": user.email})
    return AuthResponse(user=user_response, access_token=token)


@router.post("/login", response_model=AuthResponse)
async def login(data: AuthLoginSchema):
    user = await User.filter(email=data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_response = serialize(UserResponseSchema, user)
    token = create_access_token({"sub": user.email})
    return AuthResponse(user=user_response, access_token=token)


@router.get("/me", response_model=AuthResponse)
async def me(user=Depends(current_user)):
    user_response = serialize(UserResponseSchema, user)
    token = create_access_token({"sub": user.email})
    return AuthResponse(user=user_response, access_token=token)


@router.patch("/me", response_model=AuthResponse)
async def patch_me(data: UserCreateSchema, user: User=Depends(current_user)):
    user.update_from_dict(deserialize(data, exclude_unset=True))
    user.password = hash_password(data.password) 
    await user.save()
    user_response = serialize(UserResponseSchema, user)
    token = create_access_token({"sub": user.email})
    return AuthResponse(user=user_response, access_token=token)
