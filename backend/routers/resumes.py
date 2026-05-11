"""Resumes API router."""

from datetime import datetime
from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.resume import Resume


router = APIRouter()


class ResumeResponse(BaseModel):
    id: str
    name: str
    template_id: str
    content: dict
    ats_score: Optional[float] = None
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreateResumeRequest(BaseModel):
    name: str
    template_id: str = "modern"


class UpdateResumeRequest(BaseModel):
    name: Optional[str] = None
    content: Optional[dict] = None
    template_id: Optional[str] = None


@router.get("", response_model=List[ResumeResponse])
async def get_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all user's resumes."""
    result = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    request: CreateResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new resume."""
    resume = Resume(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=request.name,
        template_id=request.template_id,
        content={},
        version=1,
        is_active=True
    )

    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    request: UpdateResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a resume."""
    result = await db.execute(
        select(Resume)
        .where(Resume.id == resume_id)
        .where(Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if request.name:
        resume.name = request.name
    if request.content is not None:
        resume.content = request.content
    if request.template_id:
        resume.template_id = request.template_id

    await db.commit()
    await db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a resume."""
    result = await db.execute(
        select(Resume)
        .where(Resume.id == resume_id)
        .where(Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    await db.delete(resume)
    await db.commit()


@router.get("/templates")
async def get_templates():
    """Get available resume templates."""
    return {
        "templates": [
            {"id": "modern", "name": "Modern", "preview": "/templates/modern.png", "category": "professional"},
            {"id": "classic", "name": "Classic", "preview": "/templates/classic.png", "category": "professional"},
            {"id": "creative", "name": "Creative", "preview": "/templates/creative.png", "category": "creative"},
            {"id": "minimal", "name": "Minimal", "preview": "/templates/minimal.png", "category": "minimal"},
            {"id": "tech", "name": "Tech", "preview": "/templates/tech.png", "category": "technical"},
        ]
    }


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific resume."""
    result = await db.execute(
        select(Resume)
        .where(Resume.id == resume_id)
        .where(Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
