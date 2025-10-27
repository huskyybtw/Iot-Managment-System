from fastapi import APIRouter, HTTPException, Depends
from app.models.device_model import Device
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.schemas.device_schema import DeviceResponse, DeviceUpdate
from app.schemas.sensor_schema import SensorResponse

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("/", response_model=list[DeviceResponse])
async def devices(user=Depends(current_user), pagination: PaginationParams = Depends()):
    query = Device.filter(user=user)
    if pagination.search:
        query = query.filter(label__icontains=pagination.search)
    query = apply_pagination(query, pagination)
    return await DeviceResponse.from_queryset(query)


@router.get("/{id}", response_model=DeviceResponse)
async def device(id: int, user=Depends(current_user)):
    device = await Device.filter(id=id, user=user).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return await DeviceResponse.from_tortoise_orm(device)


@router.patch("/{id}", response_model=DeviceResponse)
async def update(id: int, input: DeviceUpdate, user=Depends(current_user)):
    device = await Device.filter(id=id, user=user).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.update_from_dict(input.model_dump(exclude_unset=True))
    await device.save()
    return await DeviceResponse.from_tortoise_orm(device)


@router.delete("/{id}", response_model=DeviceResponse)
async def delete(id: int, user=Depends(current_user)):
    device = await Device.filter(id=id, user=user).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    await device.delete()
    return await DeviceResponse.from_tortoise_orm(device)


@router.get("/{id}/sensors/{sensorId}", response_model=list[SensorResponse])
async def sensor(id: int, sensorId: int, user=Depends(current_user)):
    device = await Device.filter(id=id, user=user).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    sensor = await device.sensors.filter(id=sensorId).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return [await SensorResponse.from_tortoise_orm(sensor)]
