from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "actiontrigger" DROP CONSTRAINT IF EXISTS "fk_actiontr_sensorva_5409e599";
        ALTER TABLE "actiontrigger" DROP COLUMN "sensor_value_id";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "actiontrigger" ADD "sensor_value_id" INT NOT NULL;
        ALTER TABLE "actiontrigger" ADD CONSTRAINT "fk_actiontr_sensorva_5409e599" FOREIGN KEY ("sensor_value_id") REFERENCES "sensorvalue" ("id") ON DELETE CASCADE;"""


MODELS_STATE = (
    "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"
)
