"""Jobs API router."""

from typing import Optional, List
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.job import Job, RemoteType, EmploymentType
from models.job_match import JobMatch, JobMatchStatus


router = APIRouter()


class JobResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    requirements: List[str]
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    employment_type: str
    remote_type: str
    posted_at: str
    source: str

    model_config = ConfigDict(from_attributes=True)


class JobMatchResponse(BaseModel):
    id: str
    job_id: str
    job: JobResponse
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    status: str
    applied_at: Optional[str] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedJobsResponse(BaseModel):
    data: List[JobResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedMatchesResponse(BaseModel):
    data: List[JobMatchResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


@router.get("/search", response_model=PaginatedJobsResponse)
async def search_jobs(
    query: Optional[str] = None,
    location: Optional[str] = None,
    remote: Optional[bool] = None,
    employment_type: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search for jobs."""
    # Build query
    stmt = select(Job)
    
    if query:
        stmt = stmt.where(
            (Job.title.ilike(f"%{query}%")) |
            (Job.company.ilike(f"%{query}%")) |
            (Job.description.ilike(f"%{query}%"))
        )
    
    if location:
        stmt = stmt.where(Job.location.ilike(f"%{location}%"))
    
    if employment_type:
        stmt = stmt.where(Job.employment_type == EmploymentType(employment_type))
    if remote is True:
        stmt = stmt.where(Job.remote_type.in_([RemoteType.REMOTE, RemoteType.HYBRID]))
    elif remote is False:
        stmt = stmt.where(Job.remote_type == RemoteType.ONSITE)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    # Apply pagination
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(stmt)
    jobs = result.scalars().all()
    
    return PaginatedJobsResponse(
        data=[JobResponse(
            id=j.id,
            title=j.title,
            company=j.company,
            location=j.location,
            description=j.description[:500],
            requirements=j.requirements[:5],
            salary_min=j.salary_min,
            salary_max=j.salary_max,
            employment_type=j.employment_type.value,
            remote_type=j.remote_type.value,
            posted_at=j.posted_at.isoformat(),
            source=j.source
        ) for j in jobs],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.get("/recommended", response_model=PaginatedJobsResponse)
async def get_recommended_jobs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get recommended jobs based on user profile."""
    # In production, this would use AI-based matching
    # For now, return recent jobs
    stmt = select(Job).order_by(Job.posted_at.desc())
    
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(stmt)
    jobs = result.scalars().all()
    
    return PaginatedJobsResponse(
        data=[JobResponse(
            id=j.id,
            title=j.title,
            company=j.company,
            location=j.location,
            description=j.description[:500],
            requirements=j.requirements[:5],
            salary_min=j.salary_min,
            salary_max=j.salary_max,
            employment_type=j.employment_type.value,
            remote_type=j.remote_type.value,
            posted_at=j.posted_at.isoformat(),
            source=j.source
        ) for j in jobs],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.get("/matches", response_model=PaginatedMatchesResponse)
async def get_job_matches(
    status_filter: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's job matches."""
    stmt = (
        select(JobMatch)
        .where(JobMatch.user_id == current_user.id)
        .options(selectinload(JobMatch.job))
    )
    
    if status_filter:
        stmt = stmt.where(JobMatch.status == status_filter)
    
    stmt = stmt.order_by(JobMatch.match_score.desc())
    
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(stmt)
    matches = result.scalars().all()
    
    responses = []
    for m in matches:
        job = m.job
        if job:
            responses.append(JobMatchResponse(
                id=m.id,
                job_id=m.job_id,
                job=JobResponse(
                    id=job.id,
                    title=job.title,
                    company=job.company,
                    location=job.location,
                    description=job.description[:500],
                    requirements=job.requirements[:5],
                    salary_min=job.salary_min,
                    salary_max=job.salary_max,
                    employment_type=job.employment_type.value,
                    remote_type=job.remote_type.value,
                    posted_at=job.posted_at.isoformat(),
                    source=job.source
                ),
                match_score=m.match_score,
                matched_skills=m.matched_skills,
                missing_skills=m.missing_skills,
                status=m.status.value,
                applied_at=m.applied_at.isoformat() if m.applied_at else None,
                notes=m.notes
            ))
    
    return PaginatedMatchesResponse(
        data=responses,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.post("/save")
async def save_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save a job for later."""
    # Check if job exists
    job_result = await db.execute(select(Job).where(Job.id == job_id))
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already saved
    existing = await db.execute(
        select(JobMatch)
        .where(JobMatch.user_id == current_user.id)
        .where(JobMatch.job_id == job_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Job already saved")
    
    match = JobMatch(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        job_id=job_id,
        match_score=0.0,  # Would be calculated by AI
        matched_skills=[],
        missing_skills=[],
        status=JobMatchStatus.SAVED
    )
    
    db.add(match)
    await db.commit()
    
    return {"success": True, "message": "Job saved"}


@router.get("/stats")
async def get_job_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get job application statistics."""
    result = await db.execute(
        select(JobMatch).where(JobMatch.user_id == current_user.id)
    )
    matches = result.scalars().all()
    
    stats = {
        "total_saved": 0,
        "total_applied": 0,
        "total_interviewing": 0,
        "total_offered": 0,
        "total_rejected": 0
    }
    
    for m in matches:
        if m.status == JobMatchStatus.SAVED:
            stats["total_saved"] += 1
        elif m.status == JobMatchStatus.APPLIED:
            stats["total_applied"] += 1
        elif m.status == JobMatchStatus.INTERVIEWING:
            stats["total_interviewing"] += 1
        elif m.status == JobMatchStatus.OFFERED:
            stats["total_offered"] += 1
        elif m.status == JobMatchStatus.REJECTED:
            stats["total_rejected"] += 1
    
    return stats
