from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "sensor" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "label" VARCHAR(255),
    "pin_id" JSONB NOT NULL,
    "range_min" INT NOT NULL,
    "range_max" INT NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "in_out" BOOL NOT NULL,
    "device_id" INT REFERENCES "device" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "sensor"."type" IS 'OTHER: other';
        CREATE TABLE IF NOT EXISTS "automation" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "on_value" INT NOT NULL,
    "condition" VARCHAR(2) NOT NULL,
    "sensor_id" INT NOT NULL REFERENCES "sensor" ("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "automation"."condition" IS 'LT: lt\nGT: gt\nEQ: eq';
        CREATE TABLE IF NOT EXISTS "action" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "type" VARCHAR(20) NOT NULL,
    "target" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "automation_id" INT NOT NULL REFERENCES "automation" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "action"."type" IS 'EMAIL: email\nSMS: sms';
        CREATE TABLE IF NOT EXISTS "actiontrigger" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_id" INT NOT NULL REFERENCES "action" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "sensorvalue" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "value" INT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensor_id" INT NOT NULL REFERENCES "sensor" ("id") ON DELETE CASCADE
);
        ALTER TABLE "device" ALTER COLUMN "user_id" DROP NOT NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "device" ALTER COLUMN "user_id" SET NOT NULL;
        DROP TABLE IF EXISTS "automation";
        DROP TABLE IF EXISTS "sensor";
        DROP TABLE IF EXISTS "sensorvalue";
        DROP TABLE IF EXISTS "action";
        DROP TABLE IF EXISTS "actiontrigger";"""


MODELS_STATE = (
    "eJztnG1TozoUx78KwyvvjHdHq+5q37Var71r7V5b997Zh2FSiMgIoULwYXb87jcJhfCQIK"
    "10BcurtkkOJL+GnP85SftLdVwD2v6Hno4tF6ld5ZeKgAPJm0zNtqKC+ZyX0wIMZjZrCnib"
    "mY898pGUXgPbh6TIgL7uWfPF9VFg27TQ1UlDC5m8KEDWXQA17JoQ30CPVHz/SYotZMBH6E"
    "cf57fatQVtI9VVy6D3ZuUafpqzsiHCp6whvdtM0107cBBvPH/CNy6KW1sI01ITIugBDOnl"
    "sRfQ7tPeLcYZjSjsKW8SdjFhY8BrENg4MdySDHQXUX6kNz4boEnv8mdnd//T/uHex/1D0o"
    "T1JC759BwOj489NGQELqbqM6sHGIQtGEbOjY0+R+74BngDFDgM35B0CCAd5jBGthmQpPtZ"
    "kBG2IpJRAUfJp08hS3Uw6g3Puwp0gGX/QJPRpKv4DpueJfg64FGzITLxDYW6UwDza+/y+K"
    "x3udXZ+YNe2yWTPJz7F4uaDquivBN8gUcms5iweHJyizfmWn6OphkeHJSBeHAgp0jr0hjv"
    "gR1I5qmYYmzQQowhggC7DqAd05ZaLnN2L6+cNWFaweJJPc71rXDt5FzyME9dD1om+gyfcm"
    "tohl7kZFMXqx/L52hWRKXc13ngIfbI+clC3pABQhw+sL3Jce9koDKsM6DfPgDP0CR8SYdM"
    "E3p+nm5/YXn6+RLaMTQJWKZMpuG1msWWUXI7boJOilu+yuk42RKAgMl6Te9N7yTkIpV9CX"
    "AvqT+caNqKwJqtY4Ui0HIgWZ+ceR7fCaFAqyVaJWmYQWksLD9Eb+r57KkeBMYY2U/RMycH"
    "OR2OBpNpb/SFjsTx/TubEepNB7Smw0qfMqVbHzMeOr6I8u9weqbQj8q38cWAEXR9bHrsjr"
    "zd9JtK+0TXVQ25DxowEjMsKo3ApP29voKv11s/n/PzelU+Xn8H/l1/hW9fqz/jAkrkzFLy"
    "qsCTpdu1bqxmj2mRG2OvOXLyGDFq34aIMUKCQRJqSydg0mSTHEYSG7m8YYmdRLlUWuoCb5"
    "1PO592FRv/QH+RV5O8Dv7pKvBupXxamRkqn5/Z2elD5LvecoImZbOp8zPw4ZLYEhabBK1A"
    "BVIiFWjAK79pWYisAkxMDbH+yz+yFXCbxBdqLrnUWrR6XiyU4JWkxZrFc635sBN4b+lQFc"
    "QOi5rtorjB4G3amKFmi/p2QcxABgbtZYKG2KCNGvhzAnSalvKgL1iU5CgzZtUAXfuETOHc"
    "LaNwd+USdzencX+/VFsAapXaakrt9+OrTKiVERuhZnml2Cgt3uoDc61aY8FDoDU4KbnW4J"
    "q61Rp1W5ZqpDXeYF1fv9SYW+INrb8n4wsxRG6RoXiFyPC+G5aOtxXb8vHPeuq3AoZ00Km9"
    "yAjd1qj3X5bq8fm4n91kpBfoZwh7AJlQcyxBLlP6kKdsNilfJAAHHpcHF9psKrj3cAZ1PD"
    "0bXHYVl/nSFRbLvTKBxJ48kNjLBRJk2XMDwcnTvuvaECCJt46NMkBnxKqes7GAW388Pk+t"
    "j/3hNAPwatQfkAiNcSWNrFAh5+domN9ZLjBL2bShGUdSQXDGc3K1Q1g2PEtNj1dkg+MTC6"
    "/NCDf0BKpoi5DtSFcStH6N9rYbBGT9oWtIRRq/xtBeCmLjkwNtJFu3VXy7IJJd9ozIxh8Q"
    "aU/YvssTtu2BlGpkYXtKoKpTAut0/WxDRODzo40SubOPdmRaL1+3h7LIy7Mf1C6Tr44Nmr"
    "mVe1hqL/ewYDP3MJeuBr7/4HqCCSinmLRp5iGD9aAkIKCGAmcm2t0twJmxa+LcPCqB80gK"
    "8yiLUieKjAxVA4L0YLEcTVu2erRmejSYGyt+sWnL9ot90y82TuLkpF2bDFwmGRhmWF9Joo"
    "GZ5vX+bhx6ln6jin5jF9YURgKAt2ljgQbFAvfQ86W/b5Ik/bhJM2Xsev6EZS7IAcohLpo3"
    "E+DuTpn/UyKt5HHATu4flcgdMUQCgSM/ApQwac8AZdVJdAZoCb1RvXt5/h8GzEp0"
)
