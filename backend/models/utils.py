"""Utility functions for models."""

from datetime import datetime


def utc_now() -> datetime:
    """Get current UTC time as naive UTC datetime (no tzinfo).

    Many database columns use TIMESTAMP WITHOUT TIME ZONE; return a
    naive UTC datetime to avoid asyncpg encoding errors when inserting
    timezone-aware datetimes into tz-naive columns.
    """
    return datetime.utcnow()
