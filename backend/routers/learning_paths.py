from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.learning_path import LearningPath, LearningMilestone, LearningResource, LearningLevel, ResourceType
from models.profile import Profile
from models.target_career import TargetCareer
from models.skill import UserSkill
from services.ai_service import ai_service


router = APIRouter()


@router.get("")
async def get_learning_paths(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's learning paths."""
    result = await db.execute(
        select(LearningPath).where(LearningPath.user_id == current_user.id)
    )
    paths = result.scalars().all()
    
    return {
        "data": [{
            "id": p.id,
            "target_role": p.target_role,
            "current_level": p.current_level.value,
            "progress": p.progress,
            "is_active": p.is_active,
            "focus_areas": p.focus_areas,
            "estimated_duration": p.estimated_duration,
            "created_at": p.created_at.isoformat()
        } for p in paths]
    }


@router.get("/active")
async def get_active_learning_path(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's active learning path."""
    result = await db.execute(
        select(LearningPath)
        .where(LearningPath.user_id == current_user.id)
        .where(LearningPath.is_active == True)
    )
    path = result.scalar_one_or_none()
    
    if not path:
        return None
    
    return {
        "id": path.id,
        "target_role": path.target_role,
        "current_level": path.current_level.value,
        "progress": path.progress,
        "estimated_duration": path.estimated_duration,
        "focus_areas": path.focus_areas,
        "milestones": []  # Simplified for now
    }


@router.post("/generate")
async def generate_path(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a new AI-powered learning path."""
    # Get user profile for context
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    if not profile:
        raise HTTPException(status_code=400, detail="Please complete your profile first.")

    # Resolve target role from target_careers table, with a safe fallback.
    tc_result = await db.execute(
        select(TargetCareer).where(TargetCareer.profile_id == profile.id)
    )
    target_career = tc_result.scalar_one_or_none()
    target_role = (
        target_career.target_role
        if target_career and target_career.target_role
        else (profile.headline or "Software Engineer")
    )

    # Gather current skill names for AI context.
    skills_result = await db.execute(
        select(UserSkill)
        .options(selectinload(UserSkill.skill))
        .where(UserSkill.profile_id == profile.id)
    )
    user_skills = skills_result.scalars().all()
    current_skill_names = [
        us.skill.name for us in user_skills if getattr(us, "skill", None) and us.skill.name
    ]

    # Deactivate other paths
    await db.execute(
        LearningPath.__table__.update()
        .where(LearningPath.user_id == current_user.id)
        .values(is_active=False)
    )

    # Generate via AI
    ai_path = await ai_service.generate_learning_path(
        current_skills=current_skill_names,
        target_role=target_role
    )

    # Save to database
    path_id = str(uuid.uuid4())
    new_path = LearningPath(
        id=path_id,
        user_id=current_user.id,
        target_role=ai_path.get("target_role", target_role),
        current_level=(
            LearningLevel(ai_path.get("current_level", "beginner").lower())
            if str(ai_path.get("current_level", "beginner")).lower() in {l.value for l in LearningLevel}
            else LearningLevel.BEGINNER
        ),
        estimated_duration=ai_path.get("estimated_duration", "3 months"),
        focus_areas=ai_path.get("focus_areas", []),
        is_active=True
    )
    db.add(new_path)

    # Add milestones
    for i, m in enumerate(ai_path.get("milestones", [])):
        if not isinstance(m, dict) or not m.get("title"):
            continue
        milestone = LearningMilestone(
            id=str(uuid.uuid4()),
            path_id=path_id,
            title=m["title"],
            description=m.get("description", ""),
            order=i
        )
        db.add(milestone)

    await db.commit()
    
    return {"id": path_id, "message": "Learning path generated successfully"}
