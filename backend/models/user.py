"""User model for authentication and user management."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base
from .utils import utc_now

if TYPE_CHECKING:
    from .profile import Profile
    from .resume import Resume
    from .cover_letter import CoverLetter
    from .job_match import JobMatch
    from .interview import InterviewSession
    from .learning_path import LearningPath
    from .notification import Notification
    from .subscription import Subscription


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class User(Base):
    """User model for authentication and user data."""
    
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.user, nullable=False)
    
    # Status flags
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # Soft delete
    
    # Relationships
    profile: Mapped[Optional["Profile"]] = relationship("Profile", back_populates="user", uselist=False)
    resumes: Mapped[List["Resume"]] = relationship("Resume", back_populates="user")
    cover_letters: Mapped[List["CoverLetter"]] = relationship("CoverLetter", back_populates="user")
    job_matches: Mapped[List["JobMatch"]] = relationship("JobMatch", back_populates="user")
    interview_sessions: Mapped[List["InterviewSession"]] = relationship("InterviewSession", back_populates="user")
    learning_paths: Mapped[List["LearningPath"]] = relationship("LearningPath", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user")
    subscription: Mapped[Optional["Subscription"]] = relationship("Subscription", back_populates="user", uselist=False)
    
    @property
    def full_name(self) -> str:
        """Get the user's full name."""
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
