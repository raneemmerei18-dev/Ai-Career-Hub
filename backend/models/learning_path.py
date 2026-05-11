"""Learning path models for skill development tracking."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base
from models.utils import utc_now

if TYPE_CHECKING:
    from models.user import User


class LearningLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ResourceType(str, enum.Enum):
    COURSE = "course"
    ARTICLE = "article"
    VIDEO = "video"
    BOOK = "book"
    PROJECT = "project"
    DOCUMENTATION = "documentation"


class LearningPath(Base):
    """AI-generated learning path for skill development."""
    
    __tablename__ = "learning_paths"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Path details
    target_role: Mapped[str] = mapped_column(String(200), nullable=False)
    current_level: Mapped[LearningLevel] = mapped_column(Enum(LearningLevel), default=LearningLevel.BEGINNER, nullable=False)
    target_level: Mapped[LearningLevel] = mapped_column(Enum(LearningLevel), default=LearningLevel.ADVANCED, nullable=False)
    
    # Progress
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    estimated_duration: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # e.g., "3 months"
    
    # Focus areas
    focus_areas: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="learning_paths")
    milestones: Mapped[List["LearningMilestone"]] = relationship("LearningMilestone", back_populates="path", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<LearningPath(id={self.id}, target_role={self.target_role}, progress={self.progress})>"


class LearningMilestone(Base):
    """Milestone within a learning path."""
    
    __tablename__ = "learning_milestones"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    path_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False)
    
    # Milestone details
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    skills: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Progress
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    path: Mapped["LearningPath"] = relationship("LearningPath", back_populates="milestones")
    resources: Mapped[List["LearningResource"]] = relationship("LearningResource", back_populates="milestone", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<LearningMilestone(id={self.id}, title={self.title})>"


class LearningResource(Base):
    """Resource within a learning milestone."""
    
    __tablename__ = "learning_resources"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    milestone_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_milestones.id", ondelete="CASCADE"), nullable=False)
    
    # Resource details
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    type: Mapped[ResourceType] = mapped_column(Enum(ResourceType), nullable=False)
    url: Mapped[str] = mapped_column(String(1000), nullable=False)
    provider: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # Duration and pricing
    duration: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_free: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Progress
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    milestone: Mapped["LearningMilestone"] = relationship("LearningMilestone", back_populates="resources")
    
    def __repr__(self) -> str:
        return f"<LearningResource(id={self.id}, title={self.title})>"
