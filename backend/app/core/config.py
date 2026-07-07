from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

    PROJECT_NAME: str = "VolunTree"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"

    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "voluntree_user"
    DB_PASSWORD: str = "voluntree_pass"
    DB_NAME: str = "voluntree"

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        # Forcing our working dedicated user credentials directly
        return "mysql+pymysql://voluntree_user:voluntree_pass@localhost:3306/voluntree"

settings = Settings()