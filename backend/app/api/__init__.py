from fastapi import APIRouter
from .auth_routes import router as auth_router

router = APIRouter()
router.include_router(auth_router)
