from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "device" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "label" VARCHAR(255) NOT NULL,
    "mac_address" VARCHAR(12) NOT NULL UNIQUE,
    "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "device";"""


MODELS_STATE = (
    "eJztmG1P2zAQgP9KlU9MYqjtgJV9C6WIjtFOULYJhCI3cdOIxA62Q6lQ//ts58WJm2TtRL"
    "dW4ltzL/Hd43Pu6lcjwA706cEZfPZsaHxpvBoIBOKHptlvGCAMlVwIGBj70tRRNmPKCLAZ"
    "l06AT+G+UFKbeCHzMOJSFPm+EGKbG3rIVaIIeU8RtBh2IZtCwhX3D1zsIQe+QJo+ho/WxI"
    "O+UwjVc8TaUm6xeShlfcTOpaFYbWzZ2I8CpIzDOZtilFl7iAmpCxEkgEHxekYiEb6ILskz"
    "zSiOVJnEIeZ8HDgBkc9y6a7IwMZI8OPRUJmgK1b52G4dfj7sfDo+7HATGUkm+byI01O5x4"
    "6SwGBkLKQeMBBbSIyKG08M+svoulNAytllDho+HrSOL4VVxy8VKICqaN6IYABeLB8il00F"
    "tqOjGl4/zOvuhXm9x60+iGwwL+S4vgeJqh3rBNTcOQG2BRyHQErXQam5vQ3QjRdkAWervQ"
    "LNVrsSplAVWUYUEmut05zz+POR3pKafINTLT6Fk8fSQy2ILAM8xwR6LrqEc8mxzyMCKP5m"
    "a9yS7/5t8prt47dIayCVqjonYJa1h3xp8PR4UpDFZ9K86ZpnPUNCHAP7cQaIYxVoCg1uY0"
    "2S2S6rgnagSwACrsxfZCFizoMtabQp8Oo2m+7se5PdtuNY12RhALy1mmzmsJs9obNSU+jU"
    "dIWO3hZCQOkMk5ICrKaY99nNaWUzKDkIaKEoGJd1iRqcmt8u1ubJCjhPKmGe6ChtAkWqFm"
    "DLIM+4hnkBLIdZ9NRQOonrQfpjS2uV5+AMkT9Pdq2G7ah/1bsZmVffRSYBpU++RGSOekLT"
    "ltK5Jt071jYie0njZ3900RCPjbvhoCcJYspcIldUdqM7Q8QEIoYthGdi2FYFlkpTMMUpNH"
    "T+cmOLnu8b+183Vga/NChXD32qAOL7jJK/c6eJ4/nlNfSBJFs5QKuLk+3b46oRerHJwdeE"
    "xLOnRsnom2hqh1+gbN7H3x0af58hock5WXXWyLns5uS2kXsmcTTWgJiY7ybAVrO5yujbbF"
    "aPvkKnzWsYMYhKevrXm+GgYlBTLhrIW8QTvHc8m+03fI+yh+3EWkNRZF3o2ym8vSvzl861"
    "+214qjdk8YLTsruof3mvsvgN5aLtcg=="
)
