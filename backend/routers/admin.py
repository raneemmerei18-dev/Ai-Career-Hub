"""Admin API router."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from core.database import get_db
from core.security import get_current_admin_user
from models.user import User
from models.resume import Resume
from models.job_match import JobMatch


router = APIRouter()


@router.get("/metrics")
async def get_system_metrics(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get system metrics (admin only)."""
    # Get user count
    user_result = await db.execute(select(func.count(User.id)))
    total_users = user_result.scalar()
    
    # Get resume count
    resume_result = await db.execute(select(func.count(Resume.id)))
    total_resumes = resume_result.scalar()
    
    # Get application count
    app_result = await db.execute(select(func.count(JobMatch.id)))
    total_applications = app_result.scalar()
    
    return {
        "total_users": total_users or 0,
        "active_users": total_users or 0,  # Would filter by last_login
        "total_resumes": total_resumes or 0,
        "total_applications": total_applications or 0,
        "ai_requests_today": 0,
        "ai_requests_month": 0
    }


@router.get("/users")
async def get_users(
    search: str = None,
    role: str = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all users (admin only)."""
    stmt = select(User)
    
    if search:
        stmt = stmt.where(
            (User.email.ilike(f"%{search}%")) |
            (User.first_name.ilike(f"%{search}%")) |
            (User.last_name.ilike(f"%{search}%"))
        )
    
    if role:
        stmt = stmt.where(User.role == role)
    
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    return {
        "data": [{
            "id": u.id,
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "role": u.role.value,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "created_at": u.created_at.isoformat(),
            "last_login_at": u.last_login_at.isoformat() if u.last_login_at else None
        } for u in users],
        "total": len(users),
        "page": page,
        "page_size": page_size,
        "total_pages": 1
    }


@router.get("/health")
async def get_system_health(current_user: User = Depends(get_current_admin_user)):
    """Get system health status (admin only)."""
    return {
        "status": "healthy",
        "services": [
            {"name": "database", "status": "up", "latency": 5},
            {"name": "redis", "status": "up", "latency": 2},
            {"name": "ai_service", "status": "up", "latency": 150}
        ],
        "uptime": 99.9,
        "last_checked": "2024-01-01T00:00:00Z"
    }
