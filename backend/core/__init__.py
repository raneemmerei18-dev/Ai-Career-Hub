"""Core module containing configuration, database, and security utilities."""

# Lazy imports to avoid circular dependencies and import-time database connections

__all__ = [
    "settings",
    "Base",
    "get_db",
    "init_db",
    "hash_password",
    "verify_password",
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "get_current_user",
    "get_current_admin_user",
]

# Import settings immediately as it doesn't have side effects
from core.config import settings
