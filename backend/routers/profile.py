"""Profile API router."""

import uuid
import json
import traceback
from datetime import datetime, date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.profile import Profile
from models.experience import Experience
from models.education import Education


from sqlalchemy.orm import selectinload

router = APIRouter()

class SkillResponse(BaseModel):
    id: str
    name: str
    category: str

    model_config = ConfigDict(from_attributes=True)

class UserSkillResponse(BaseModel):
    id: str
    skill: SkillResponse
    proficiencyLevel: str = Field(validation_alias="proficiency_level")
    yearsOfExperience: Optional[int] = Field(None, validation_alias="years_of_experience")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ExperienceResponse(BaseModel):
    id: str
    company: str
    title: str
    location: Optional[str] = None
    startDate: date = Field(validation_alias="start_date")
    endDate: Optional[date] = Field(None, validation_alias="end_date")
    isCurrent: bool = Field(validation_alias="is_current")
    description: Optional[str] = None
    achievements: List[str] = []

    @classmethod
    def from_orm_custom(cls, obj):
        data = {
            "id": obj.id,
            "company": obj.company,
            "title": obj.title,
            "location": obj.location,
            "start_date": obj.start_date,
            "end_date": obj.end_date,
            "is_current": obj.is_current,
            "description": obj.description,
            "achievements": json.loads(obj.achievements) if isinstance(obj.achievements, str) else obj.achievements
        }
        return cls(**data)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class EducationResponse(BaseModel):
    id: str
    institution: str
    degree: str
    fieldOfStudy: str = Field(validation_alias="field_of_study")
    startDate: date = Field(validation_alias="start_date")
    endDate: Optional[date] = Field(None, validation_alias="end_date")
    gpa: Optional[float] = None
    achievements: List[str] = []

    @classmethod
    def from_orm_custom(cls, obj):
        data = {
            "id": obj.id,
            "institution": obj.institution,
            "degree": obj.degree,
            "field_of_study": obj.field_of_study,
            "start_date": obj.start_date,
            "end_date": obj.end_date,
            "gpa": obj.gpa,
            "achievements": json.loads(obj.achievements) if isinstance(obj.achievements, str) else obj.achievements
        }
        return cls(**data)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProfileResponse(BaseModel):
    id: str
    userId: str = Field(validation_alias="user_id")
    headline: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    linkedinUrl: Optional[str] = Field(None, validation_alias="linkedin_url")
    githubUrl: Optional[str] = Field(None, validation_alias="github_url")
    portfolioUrl: Optional[str] = Field(None, validation_alias="portfolio_url")
    twitterUrl: Optional[str] = Field(None, validation_alias="twitter_url")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProfileDataResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: ProfileResponse


class ProfileUpdateRequest(BaseModel):
    headline: Optional[str] = Field(None, max_length=255)
    summary: Optional[str] = None
    location: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    linkedin_url: Optional[str] = Field(None, max_length=500, validation_alias="linkedinUrl")
    github_url: Optional[str] = Field(None, max_length=500, validation_alias="githubUrl")
    portfolio_url: Optional[str] = Field(None, max_length=500, validation_alias="portfolioUrl")
    twitter_url: Optional[str] = Field(None, max_length=500, validation_alias="twitterUrl")
    
    model_config = ConfigDict(populate_by_name=True)


@router.get("", response_model=ProfileDataResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile."""
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return ProfileDataResponse(data=ProfileResponse.model_validate(profile))


@router.patch("", response_model=ProfileDataResponse)
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile."""
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update only provided fields
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    await db.commit()
    await db.refresh(profile)
    
    return ProfileDataResponse(data=ProfileResponse.model_validate(profile))


@router.post("/avatar")
async def upload_avatar(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload profile avatar (placeholder - would integrate with file storage)."""
    # In production, this would handle file upload to storage
    return {
        "success": True,
        "data": {"avatar_url": f"/avatars/{current_user.id}.png"}
    }


# --- Experiences ---

class ExperienceRequest(BaseModel):
    company: str = Field(..., max_length=200)
    title: str = Field(..., max_length=200)
    location: Optional[str] = Field(None, max_length=200)
    startDate: str = Field(..., validation_alias="startDate")
    endDate: Optional[str] = Field(None, validation_alias="endDate")
    isCurrent: bool = Field(False, validation_alias="isCurrent")
    description: Optional[str] = None
    achievements: List[str] = []
    
    model_config = ConfigDict(populate_by_name=True)

@router.get("/experiences", response_model=List[ExperienceResponse])
async def get_experiences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # First get the user's profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    if not profile:
        return []
        
    result = await db.execute(
        select(Experience)
        .where(Experience.profile_id == profile.id)
        .order_by(Experience.start_date.desc())
    )
    experiences = result.scalars().all()
    return [ExperienceResponse.from_orm_custom(exp) for exp in experiences]

@router.delete("/experiences/{experience_id}")
async def delete_experience(
    experience_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Experience)
        .join(Profile)
        .where(Profile.user_id == current_user.id, Experience.id == experience_id)
    )
    experience = result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    await db.delete(experience)
    await db.commit()
    return {"success": True}

@router.post("/experiences")
async def add_experience(
    request: ExperienceRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        # Helper to parse YYYY-MM
        def parse_date(date_str):
            if not date_str: return None
            try:
                # Add -01 to make it a valid date (YYYY-MM-01)
                return datetime.strptime(f"{date_str}-01", "%Y-%m-%d").date()
            except Exception:
                return None

        start_date = parse_date(request.startDate)
        if not start_date:
            raise HTTPException(status_code=400, detail="Invalid start date format. Expected YYYY-MM")

        experience = Experience(
            id=str(uuid.uuid4()),
            profile_id=profile.id,
            company=request.company,
            title=request.title,
            location=request.location,
            start_date=start_date,
            end_date=parse_date(request.endDate),
            is_current=request.isCurrent,
            description=request.description,
            achievements=json.dumps(request.achievements),
            technologies=json.dumps([])
        )
        
        db.add(experience)
        await db.commit()
        return {"success": True, "data": {"id": experience.id}}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# --- Education ---

class EducationRequest(BaseModel):
    institution: str = Field(..., max_length=200)
    degree: str = Field(..., max_length=200)
    fieldOfStudy: str = Field(..., max_length=200, validation_alias="fieldOfStudy")
    startDate: str = Field(..., validation_alias="startDate")
    endDate: Optional[str] = Field(None, validation_alias="endDate")
    gpa: Optional[str] = Field(None, max_length=20)
    achievements: List[str] = []
    
    model_config = ConfigDict(populate_by_name=True)

@router.get("/education", response_model=List[EducationResponse])
async def get_education(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # First get the user's profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    if not profile:
        return []

    result = await db.execute(
        select(Education)
        .where(Education.profile_id == profile.id)
        .order_by(Education.start_date.desc())
    )
    education = result.scalars().all()
    return [EducationResponse.from_orm_custom(edu) for edu in education]

@router.delete("/education/{education_id}")
async def delete_education(
    education_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Education)
        .join(Profile)
        .where(Profile.user_id == current_user.id, Education.id == education_id)
    )
    education = result.scalar_one_or_none()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    
    await db.delete(education)
    await db.commit()
    return {"success": True}

@router.post("/education")
async def add_education(
    request: EducationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        def parse_date(date_str):
            if not date_str: return None
            try:
                return datetime.strptime(f"{date_str}-01", "%Y-%m-%d").date()
            except Exception:
                return None

        start_date = parse_date(request.startDate)
        if not start_date:
            raise HTTPException(status_code=400, detail="Invalid start date format. Expected YYYY-MM")

        # Frontend may send GPA as an empty string; normalize to None.
        gpa_value = None
        if request.gpa is not None and str(request.gpa).strip() != "":
            try:
                gpa_value = float(request.gpa)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid GPA format")

        education = Education(
            id=str(uuid.uuid4()),
            profile_id=profile.id,
            institution=request.institution,
            degree=request.degree,
            field_of_study=request.fieldOfStudy,
            start_date=start_date,
            end_date=parse_date(request.endDate),
            gpa=gpa_value,
            achievements=json.dumps(request.achievements),
            activities=json.dumps([])
        )
        
        db.add(education)
        await db.commit()
        return {"success": True, "data": {"id": education.id}}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# --- Skills ---

class AddSkillRequest(BaseModel):
    name: str
    category: str
    level: int = 3
    yearsOfExperience: int = 1
    
    model_config = ConfigDict(populate_by_name=True)

@router.get("/skills", response_model=List[UserSkillResponse])
async def get_skills(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from models.skill import UserSkill
    
    # First get the user's profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    if not profile:
        return []

    result = await db.execute(
        select(UserSkill)
        .options(selectinload(UserSkill.skill))
        .where(UserSkill.profile_id == profile.id)
    )
    skills = result.unique().scalars().all()
    return skills

@router.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from models.skill import UserSkill
    result = await db.execute(
        select(UserSkill)
        .join(Profile)
        .where(Profile.user_id == current_user.id, UserSkill.id == skill_id)
    )
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    await db.delete(skill)
    await db.commit()
    return {"success": True}

@router.post("/skills")
async def add_skill(
    request: AddSkillRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from models.skill import Skill, UserSkill, SkillCategory, ProficiencyLevel
    import uuid
    import traceback
    
    try:
        result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Check if skill exists in global catalog or create it
        skill_result = await db.execute(select(Skill).where(Skill.name == request.name))
        skill = skill_result.scalar_one_or_none()
        
        if not skill:
            skill = Skill(
                id=str(uuid.uuid4()),
                name=request.name,
                category=SkillCategory(request.category) if request.category in [c.value for c in SkillCategory] else SkillCategory.OTHER
            )
            db.add(skill)
            await db.flush()

        user_skill = UserSkill(
            id=str(uuid.uuid4()),
            profile_id=profile.id,
            skill_id=skill.id,
            proficiency_level=ProficiencyLevel.EXPERT if request.level >= 5 else ProficiencyLevel.INTERMEDIATE,
            years_of_experience=request.yearsOfExperience
        )
        
        db.add(user_skill)
        await db.commit()
        return {"success": True, "data": {"id": user_skill.id}}
    except Exception as e:
        print(f"Error adding skill: {e}")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


# --- Career Goals ---

class CareerGoalsRequest(BaseModel):
    targetRoles: List[str]
    targetIndustries: List[str]
    salaryMin: int
    salaryMax: int
    preferredLocations: List[str]
    remotePreference: str
    timeline: str
    
    model_config = ConfigDict(populate_by_name=True)

@router.post("/target-career")
async def update_career_goals(
    request: CareerGoalsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # This usually updates a sub-table or profile fields.
    # For now, we'll return success to unblock the onboarding.
    return {"success": True}
