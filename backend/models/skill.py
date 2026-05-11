"""Skill models for user skills and skill categories."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base

if TYPE_CHECKING:
    from models.profile import Profile


class SkillCategory(str, enum.Enum):
    TECHNICAL = "technical"
    SOFT = "soft"
    LANGUAGE = "language"
    TOOL = "tool"
    FRAMEWORK = "framework"
    DATABASE = "database"
    CLOUD = "cloud"
    OTHER = "other"


class ProficiencyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Skill(Base):
    """Master skill catalog."""
    
    __tablename__ = "skills"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[SkillCategory] = mapped_column(Enum(SkillCategory), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Metadata
    popularity_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f"<Skill(id={self.id}, name={self.name})>"


class UserSkill(Base):
    """User skill association with proficiency level."""
    
    __tablename__ = "user_skills"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    skill_id: Mapped[str] = mapped_column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    
    # Proficiency
    proficiency_level: Mapped[ProficiencyLevel] = mapped_column(Enum(ProficiencyLevel), default=ProficiencyLevel.INTERMEDIATE, nullable=False)
    years_of_experience: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill")
    
    def __repr__(self) -> str:
        return f"<UserSkill(id={self.id}, profile_id={self.profile_id}, skill_id={self.skill_id})>"
