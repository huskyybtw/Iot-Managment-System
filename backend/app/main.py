from fastapi import FastAPI, Response, Query
from tortoise.contrib.fastapi import register_tortoise
from app.api import router
from dotenv import load_dotenv
import os

load_dotenv()

TORTOISE_ORM = {
    "connections": {"default": os.getenv("DATABASE_URL")},
    "apps": {
        "models": {
            "models": ["app.models.user_model", "aerich.models"],
            "default_connection": "default",
        },
    },
}

from fastapi import FastAPI

app = FastAPI(
    swagger_ui_init_oauth={
        "usePkceWithAuthorizationCodeGrant": True,
        "clientId": "your-client-id",  # Optional, for OAuth2 flows
        "scopes": "openid profile email",  # Optional
        "authorizationUrl": "http://localhost:8000/auth/login",  # Optional
    }
)
register_tortoise(
    app,
    db_url=os.getenv("DATABASE_URL"),
    modules={"models": ["app.models"]},
    generate_schemas=False,
    add_exception_handlers=True,
)


@app.get("/")
async def scalar_docs(
    url: str = Query(None),
    proxyUrl: str = Query("https://proxy.scalar.com"),
):
    api_json_url = url or os.getenv(
        "API_JSON_URL", "http://127.0.0.1:8000/openapi.json"
    )
    scalar_custom_css = ""
    html = f"""
      <!doctype html>
      <html>
        <head>
          <title>API Reference</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>{scalar_custom_css}</style>
        </head>
        <body>
          <script
            id="api-reference"
            data-url="{api_json_url}"
            data-proxy-url="{proxyUrl}">
          </script>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        </body>
      </html>
    """
    return Response(content=html, media_type="text/html")


app.include_router(router)
