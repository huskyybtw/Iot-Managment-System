from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "device" ALTER COLUMN "label" DROP NOT NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "device" ALTER COLUMN "label" SET NOT NULL;"""


MODELS_STATE = (
    "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"
)
