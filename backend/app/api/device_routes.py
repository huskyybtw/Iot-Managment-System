from fastapi import APIRouter, HTTPException, Depends
from app.models.device_model import Device
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.schemas.device_schema import DeviceResponse
from app.common.mapper import serialize, deserialize

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("/", response_model=list[DeviceResponse])
async def devices(user=Depends(current_user), pagination: PaginationParams = Depends()):
    query = Device.filter(user=user)
    if pagination.search:
        query = query.filter(label__icontains=pagination.search)
    query = apply_pagination(query, pagination)
    devices = await query.all()
    return serialize(DeviceResponse, devices)
