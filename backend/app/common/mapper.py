def serialize(schema_cls, tortoise_obj):
    data = {}
    for field in schema_cls.model_fields:
        value = getattr(tortoise_obj, field, None)
        if hasattr(value, "isoformat"):
            value = value.isoformat()
        data[field] = value
    return schema_cls(**data)


def deserialize(pydantic_obj):
    return pydantic_obj.model_dump()
