def serialize(schema_cls, tortoise_obj):
    def serialize_one(obj):
        data = {}
        for field in schema_cls.model_fields:
            value = getattr(obj, field, None)
            if hasattr(value, "isoformat"):
                value = value.isoformat()
            data[field] = value
        return schema_cls(**data)

    if isinstance(tortoise_obj, list):
        return [serialize_one(obj) for obj in tortoise_obj]
    else:
        return serialize_one(tortoise_obj)


def deserialize(pydantic_obj):
    return pydantic_obj.model_dump()


# def deserialize(pydantic_obj):
#     def deserialize_one(obj):
#         return obj.model_dump()

#     if isinstance(pydantic_obj, list):
#         return [deserialize_one(obj) for obj in pydantic_obj]
#     else:
#         return deserialize_one(pydantic_obj)
