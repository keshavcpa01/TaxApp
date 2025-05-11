import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # JWT / Auth
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-fallback")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")  # ✅ Fixed name and default
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # SendGrid
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    SENDGRID_FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL", "noreply@example.com")

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")

    class Config:
        env_file = ".env"

settings = Settings()
