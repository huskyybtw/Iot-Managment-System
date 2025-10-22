from app.models.user_model import User
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import verify_token
from app.schemas.user_schema import UserResponseSchema
from app.common.mapper import schema

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await User.filter(email=payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    response = schema(UserResponseSchema, user)
    return response
