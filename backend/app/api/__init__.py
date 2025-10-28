from fastapi import APIRouter
from .auth_routes import router as auth_router
from .device_routes import router as device_router
from .automation_routes import router as automation_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(device_router)
router.include_router(automation_router)
