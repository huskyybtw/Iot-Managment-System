from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from app.api import router as api_router
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env

app = FastAPI()
register_tortoise(
    app,
    db_url=os.getenv("DATABASE_URL"),
    modules={"models": ["app.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application"}


app.include_router(api_router)
