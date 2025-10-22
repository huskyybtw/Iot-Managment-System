from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "email" VARCHAR(128) NOT NULL UNIQUE,
    "password" VARCHAR(128) NOT NULL,
    "phone_number" VARCHAR(9) NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztlm1v2jAQx79KlFed1FWQ0Rb2LmVMZRowtXSbWlWRSUywcOw0dkZRxXefz0nIAwTRaR"
    "JF6jvyv7v47ncOdy9mwD1MxdmdwJH52XgxGQqw+lHSTw0ThWGugiDRhGrHOPOYCBkhVypt"
    "iqjASvKwcCMSSsKZUllMKYjcVY6E+bkUM/IUY0dyH8uZzuPhUcmEefgZi+wxnDtTgqlXSp"
    "N4cLbWHbkMtdZn8qt2hNMmjstpHLDcOVzKGWdrb8IkqD5mOEISw+tlFEP6kF1aZVZRkmnu"
    "kqRYiPHwFMVUFsrdk4HLGfBT2QhdoA+nfLSarctW+9NFq61cdCZr5XKVlJfXngRqAsOxud"
    "J2JFHioTHm3HCACN1E152haDu7dUAFn0q6ii+DdVB+AXp2KGa+nKnHptXeQeunfdO9tm9O"
    "lNcHqIWra5zc7WFqshIbIM0RhkiIBY+2XMB6isWY/wMyE3KS+dd3PCgVCOywOJgk/yV746"
    "zEHePd7OyBs1MLs1NF6UYYSnWQ3AT5RVkkCfB2mOXICkovDT3LfrzRu6pq8EaMLtOu7WA7"
    "7g96t2N78AMqCYR4ohqRPe6BxdLqsqKeXFQasX6J8as/vjbg0bgfDXuaIBfSj/SJud/43o"
    "ScUCy5w/jCQV7hgmVqBqbU2Dj0/rGx5cj3xh60sTp5WGem88JgBmGC3PkCRZ6zYeEWr/Pd"
    "NAVWUFUQQ77uCrCFLNPlzsYRcWfb1r7UsnPxQ7nP++p3RKvfHxwJSOkVc7YQcpxbi3V+vs"
    "eYVV61g1bbyqMWPo1XQEzdjxNgs9HYZ+1rNOrXPrBVdhXOJGZb5tm329GwZknJQyog75gq"
    "8MEjrjw1KBHy8W1i3UERqi7NrAzeycD+XeXa/T66qg4jeMGVYnzQ8bL6C2eNNZQ="
)
