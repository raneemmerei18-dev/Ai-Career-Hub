"""Notifications API router."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.notification import Notification


router = APIRouter()


@router.get("")
async def get_notifications(
    unread_only: bool = False,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's notifications."""
    stmt = select(Notification).where(Notification.user_id == current_user.id)
    
    if unread_only:
        stmt = stmt.where(Notification.is_read == False)
    
    stmt = stmt.order_by(Notification.created_at.desc())
    
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    
    return {
        "data": [{
            "id": n.id,
            "type": n.type.value,
            "title": n.title,
            "message": n.message,
            "action_url": n.action_url,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat()
        } for n in notifications],
        "total": len(notifications),
        "page": page,
        "page_size": page_size,
        "total_pages": 1
    }


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get count of unread notifications."""
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .where(Notification.is_read == False)
    )
    notifications = result.scalars().all()
    return {"count": len(notifications)}


@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a notification as read."""
    result = await db.execute(
        select(Notification)
        .where(Notification.id == notification_id)
        .where(Notification.user_id == current_user.id)
    )
    notification = result.scalar_one_or_none()
    
    if notification:
        notification.is_read = True
        await db.commit()
    
    return {"success": True}


@router.post("/mark-all-read")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read."""
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .where(Notification.is_read == False)
    )
    notifications = result.scalars().all()
    
    for n in notifications:
        n.is_read = True
    
    await db.commit()
    return {"success": True}


@router.get("/recent")
async def get_recent_notifications(
    limit: int = Query(default=5, le=20),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get recent notifications."""
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    )
    notifications = result.scalars().all()
    
    return [{
        "id": n.id,
        "type": n.type.value,
        "title": n.title,
        "message": n.message,
        "action_url": n.action_url,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat()
    } for n in notifications]
