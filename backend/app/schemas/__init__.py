"""
Initialize Tortoise ORM models before creating Pydantic schemas.
This allows pydantic_model_creator to properly handle relations.
"""

from tortoise import Tortoise

# Initialize all models with their relations
Tortoise.init_models(["app.models"], "models")
