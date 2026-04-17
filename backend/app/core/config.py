from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    model: str = "gpt-4o"
    max_tokens: int = 4096
    secret_key: str = "change-this-in-production-use-a-long-random-string"
    tavily_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
