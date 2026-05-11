"""Profile model for user profile data."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from models.utils import utc_now

if TYPE_CHECKING:
    from models.user import User
    from models.skill import UserSkill
    from models.experience import Experience
    from models.education import Education
    from models.project import Project
    from models.certification import Certification
    from models.language import Language
    from models.target_career import TargetCareer


class Profile(Base):
    """User profile containing professional information."""
    
    __tablename__ = "profiles"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Professional info
    headline: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Contact info
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # Social/portfolio links
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    portfolio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    twitter_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="profile")
    skills: Mapped[List["UserSkill"]] = relationship("UserSkill", back_populates="profile", cascade="all, delete-orphan")
    experiences: Mapped[List["Experience"]] = relationship("Experience", back_populates="profile", cascade="all, delete-orphan")
    education: Mapped[List["Education"]] = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    projects: Mapped[List["Project"]] = relationship("Project", back_populates="profile", cascade="all, delete-orphan")
    certifications: Mapped[List["Certification"]] = relationship("Certification", back_populates="profile", cascade="all, delete-orphan")
    languages: Mapped[List["Language"]] = relationship("Language", back_populates="profile", cascade="all, delete-orphan")
    target_career: Mapped[Optional["TargetCareer"]] = relationship("TargetCareer", back_populates="profile", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Profile(id={self.id}, user_id={self.user_id})>"
