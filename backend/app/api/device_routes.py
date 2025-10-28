from fastapi import APIRouter, HTTPException, Depends
from app.models.device_model import Device
from app.common.auth import current_user
from app.common.pagination import PaginationParams, apply_pagination
from app.schemas.device_schema import (
    DeviceResponse,
    DeviceCreate,
    DeviceUpdate,
    DeviceAttach,
)
from app.schemas.sensor_schema import SensorResponse
from tortoise.transactions import in_transaction
from app.models.sensor_model import Sensor

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


@router.post("/", response_model=DeviceResponse)
async def create(input: DeviceCreate, user=Depends(current_user)):
    if not input.sensors or len(input.sensors) == 0:
        raise HTTPException(status_code=400, detail="At least one sensor is required")

    async with in_transaction() as connection:
        input_dict = input.model_dump(exclude={"sensors"})
        device = await Device.create(**input_dict, user=user, using_db=connection)

        for sensor in input.sensors:
            sensor_dict = sensor.model_dump()
            await Sensor.create(**sensor_dict, device=device, using_db=connection)

        await device.fetch_related("sensors")
        return await DeviceResponse.from_tortoise_orm(device)


@router.put("/{macAddress}", response_model=DeviceResponse)
async def attach(macAddress: str, input: DeviceAttach, user=Depends(current_user)):
    device = await Device.filter(mac_address=macAddress).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.label = input.label
    device.user = user
    await device.save()
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
    device.user = None
    await device.save()
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
