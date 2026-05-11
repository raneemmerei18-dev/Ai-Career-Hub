"""
Application configuration using Pydantic Settings.
"""

from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator, AliasChoices


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Environment
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    
    # API Configuration
    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=8000)
    
    # CORS - Accept string or list
    CORS_ORIGINS: Union[str, List[str]] = Field(default="http://localhost:3000")
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str):
            value = v.strip()
            if value.startswith("[") and value.endswith("]"):
                # Supports JSON-like list values from .env.
                value = value.strip("[]")
            return [origin.strip().strip('"').strip("'") for origin in value.split(",") if origin.strip()]
        if isinstance(v, list):
            return v
        return ["http://localhost:3000"]
    
    # Database (PostgreSQL)
    DATABASE_URL: str = Field(default="postgresql+asyncpg://postgres:raneem12$@localhost:5432/ai_career_hub")
    DATABASE_ECHO: bool = Field(default=False)
    
    # JWT Configuration
    JWT_SECRET_KEY: str = Field(
        default="change-this-secret-in-production",
        validation_alias=AliasChoices("JWT_SECRET_KEY", "SECRET_KEY"),
    )
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)
    
    # Redis (for caching and sessions)
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    
    # AI Provider Configuration
    GROQ_API_KEY: str = Field(default="")
    
    # Default AI Provider
    DEFAULT_AI_PROVIDER: str = Field(default="groq")
    
    # Application Metadata
    APP_NAME: str = Field(default="AI Career Hub")
    SECRET_KEY: str = Field(default="your-secret-key-change-in-production")
    
    # AWS Configuration
    AWS_REGION: str = Field(default="us-east-1")
    
    # Stripe Configuration
    STRIPE_SECRET_KEY: str = Field(default="")
    STRIPE_PUBLISHABLE_KEY: str = Field(default="")
    STRIPE_WEBHOOK_SECRET: str = Field(default="")
    
    # Logging Configuration
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FILE: str = Field(default="logs/app.log")
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = Field(default=100)
    RATE_LIMIT_WINDOW: int = Field(default=60)
    
    # File Upload
    MAX_UPLOAD_SIZE: int = Field(default=10 * 1024 * 1024)  # 10MB
    ALLOWED_FILE_TYPES: List[str] = Field(default=["pdf", "docx", "png", "jpg", "jpeg"])
    
    # Email Configuration (for verification emails)
    SMTP_HOST: str = Field(default="")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="")
    SMTP_PASSWORD: str = Field(default="")
    FROM_EMAIL: str = Field(default="noreply@aicareerhub.com")
    
    # External Job APIs
    ADZUNA_APP_ID: str = Field(default="")
    ADZUNA_API_KEY: str = Field(default="")
    JSEARCH_API_KEY: str = Field(default="")

    # OAuth (Google)
    GOOGLE_CLIENT_ID: str = Field(default="")
    GOOGLE_CLIENT_SECRET: str = Field(default="")
    GOOGLE_REDIRECT_URI: str = Field(default="http://localhost:8000/api/v1/auth/social-callback/google")
    FRONTEND_URL: str = Field(default="http://localhost:3000")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        validate_default=True,
        extra="ignore",
    )


# Create settings instance
settings = Settings()
