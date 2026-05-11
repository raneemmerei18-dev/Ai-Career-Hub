"""Skills API router."""

from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.profile import Profile
from models.skill import Skill, UserSkill, SkillCategory, ProficiencyLevel


router = APIRouter()


class SkillResponse(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserSkillResponse(BaseModel):
    id: str
    skill_id: str
    skill: SkillResponse
    proficiency_level: str
    years_of_experience: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class AddSkillRequest(BaseModel):
    skill_id: str
    proficiency_level: str = "intermediate"
    years_of_experience: Optional[int] = None


class UpdateSkillRequest(BaseModel):
    proficiency_level: Optional[str] = None
    years_of_experience: Optional[int] = None


@router.get("/catalog", response_model=List[SkillResponse])
async def get_skill_catalog(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get available skills from catalog."""
    query = select(Skill)
    
    if category:
        query = query.where(Skill.category == category)
    
    if search:
        query = query.where(Skill.name.ilike(f"%{search}%"))
    
    query = query.limit(limit)
    
    result = await db.execute(query)
    skills = result.scalars().all()
    
    return skills


@router.get("/categories")
async def get_skill_categories():
    """Get available skill categories."""
    return {
        "categories": [
            {"id": "technical", "name": "Technical Skills"},
            {"id": "soft", "name": "Soft Skills"},
            {"id": "language", "name": "Programming Languages"},
            {"id": "tool", "name": "Tools & Software"},
            {"id": "framework", "name": "Frameworks & Libraries"},
            {"id": "database", "name": "Databases"},
            {"id": "cloud", "name": "Cloud & DevOps"},
            {"id": "other", "name": "Other"},
        ]
    }


@router.get("/user", response_model=List[UserSkillResponse])
async def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's skills."""
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    result = await db.execute(
        select(UserSkill)
        .where(UserSkill.profile_id == profile.id)
        .options(selectinload(UserSkill.skill))
    )
    user_skills = result.scalars().all()
    
    skills_response = []
    for us in user_skills:
        skill = us.skill
        if skill:
            skills_response.append(UserSkillResponse(
                id=us.id,
                skill_id=us.skill_id,
                skill=SkillResponse(
                    id=skill.id,
                    name=skill.name,
                    category=skill.category.value,
                    description=skill.description
                ),
                proficiency_level=us.proficiency_level.value,
                years_of_experience=us.years_of_experience
            ))
    
    return skills_response


@router.post("/user", response_model=UserSkillResponse, status_code=status.HTTP_201_CREATED)
async def add_user_skill(
    request: AddSkillRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a skill to user's profile."""
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check if skill exists
    skill_result = await db.execute(select(Skill).where(Skill.id == request.skill_id))
    skill = skill_result.scalar_one_or_none()
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # Check if already added
    existing = await db.execute(
        select(UserSkill)
        .where(UserSkill.profile_id == profile.id)
        .where(UserSkill.skill_id == request.skill_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Skill already added")
    
    user_skill = UserSkill(
        id=str(uuid.uuid4()),
        profile_id=profile.id,
        skill_id=request.skill_id,
        proficiency_level=ProficiencyLevel(request.proficiency_level),
        years_of_experience=request.years_of_experience
    )
    
    db.add(user_skill)
    await db.commit()
    await db.refresh(user_skill)
    
    return UserSkillResponse(
        id=user_skill.id,
        skill_id=user_skill.skill_id,
        skill=SkillResponse(
            id=skill.id,
            name=skill.name,
            category=skill.category.value,
            description=skill.description
        ),
        proficiency_level=user_skill.proficiency_level.value,
        years_of_experience=user_skill.years_of_experience
    )


@router.patch("/user/{skill_id}", response_model=UserSkillResponse)
async def update_user_skill(
    skill_id: str,
    request: UpdateSkillRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a user skill."""
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    result = await db.execute(
        select(UserSkill)
        .where(UserSkill.profile_id == profile.id)
        .where(UserSkill.id == skill_id)
    )
    user_skill = result.scalar_one_or_none()
    
    if not user_skill:
        raise HTTPException(status_code=404, detail="User skill not found")
    
    if request.proficiency_level:
        user_skill.proficiency_level = ProficiencyLevel(request.proficiency_level)
    if request.years_of_experience is not None:
        user_skill.years_of_experience = request.years_of_experience
    
    await db.commit()
    await db.refresh(user_skill)
    
    # Fetch skill details
    skill_result = await db.execute(select(Skill).where(Skill.id == user_skill.skill_id))
    skill = skill_result.scalar_one()
    
    return UserSkillResponse(
        id=user_skill.id,
        skill_id=user_skill.skill_id,
        skill=SkillResponse(
            id=skill.id,
            name=skill.name,
            category=skill.category.value,
            description=skill.description
        ),
        proficiency_level=user_skill.proficiency_level.value,
        years_of_experience=user_skill.years_of_experience
    )


@router.delete("/user/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_user_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a skill from user's profile."""
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    result = await db.execute(
        select(UserSkill)
        .where(UserSkill.profile_id == profile.id)
        .where(UserSkill.id == skill_id)
    )
    user_skill = result.scalar_one_or_none()
    
    if not user_skill:
        raise HTTPException(status_code=404, detail="User skill not found")
    
    await db.delete(user_skill)
    await db.commit()
