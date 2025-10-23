USER_EXAMPLE = {
    "id": 4,
    "email": "marek@example.com",
    "phone_number": "123456789",
    "created_at": "2025-10-22T12:30:00.743817+00:00",
    "updated_at": "2025-10-22T12:30:00.743829+00:00",
}

DEVICE_EXAMPLE = {
    "id": 1,
    "label": "Temperature Sensor",
    "mac_address": "A1B2C3D4E5F6",
    "user": USER_EXAMPLE,
}

DEVICE_UPDATE_EXAMPLE = {"label": DEVICE_EXAMPLE["label"]}
USER_EXAMPLE = {
    "id": 4,
    "email": "marek@example.com",
    "phone_number": "123456789",
    "created_at": "2025-10-22T12:30:00.743817+00:00",
    "updated_at": "2025-10-22T12:30:00.743829+00:00",
}

DEVICE_EXAMPLE = {
    "id": 1,
    "label": "Temperature Sensor",
    "mac_address": "A1B2C3D4E5F6",
    "user": USER_EXAMPLE,
}

USER_CREATE_EXAMPLE = {
    "email": "marek@example.com",
    "phone_number": "123456789",
    "password": "strongpassword",
}

AUTH_RESPONSE_EXAMPLE = {
    "user": USER_EXAMPLE,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
}

SENSOR_EXAMPLE = {
    "id": 1,
    "label": "Temperature Sensor",
    "pin_id": {"gpio": 17},
    "range_min": -40,
    "range_max": 125,
    "type": "temperature",
    "in_out": True,
}

SENSOR_CREATE_EXAMPLE = {
    "label": "Temperature Sensor",
    "pin_id": {"gpio": 17},
    "range_min": -40,
    "range_max": 125,
    "type": "temperature",
    "in_out": True,
}

SENSOR_VALUE_EXAMPLE = {
    "id": 1,
    "sensor": 1,
    "value": 42,
    "timestamp": "2025-10-23T12:00:00Z",
}

SENSOR_VALUE_CREATE_EXAMPLE = {"sensor": 1, "value": 42}
