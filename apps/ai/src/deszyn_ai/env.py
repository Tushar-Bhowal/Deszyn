import sys
from typing import Literal

from pydantic import HttpUrl, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_ENV: Literal["development", "staging", "production"]
    PORT: int = 8001

    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str

    MONGODB_URI: str
    REDIS_URL: str

    INTERNAL_API_SECRET: str
    SERVER_BASE_URL: HttpUrl


try:
    env = Settings()
except ValidationError as e:
    print("Invalid environment variables:", file=sys.stderr)
    print(e, file=sys.stderr)
    sys.exit(1)
