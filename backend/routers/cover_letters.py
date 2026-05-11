"""Cover Letters API router."""

from fastapi import APIRouter, Depends
from core.security import get_current_user
from models.user import User


router = APIRouter()


@router.get("")
async def get_cover_letters(current_user: User = Depends(get_current_user)):
    """Get all user's cover letters."""
    return {"data": [], "total": 0, "page": 1, "page_size": 20, "total_pages": 0}


@router.post("")
async def create_cover_letter(current_user: User = Depends(get_current_user)):
    """Create a new cover letter."""
    return {"id": "placeholder", "message": "Cover letter endpoint placeholder"}
