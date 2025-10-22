from passlib.hash import bcrypt

MAX_BCRYPT_LENGTH = 72


def hash_password(password: str) -> str:
    return bcrypt.hash(password[:MAX_BCRYPT_LENGTH])


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password[:MAX_BCRYPT_LENGTH], hashed)
