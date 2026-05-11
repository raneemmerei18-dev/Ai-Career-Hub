"""Target career model for career goals."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base

if TYPE_CHECKING:
    from models.profile import Profile


class RemotePreference(str, enum.Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"
    ANY = "any"


class TargetCareer(Base):
    """User's career goals and preferences."""
    
    __tablename__ = "target_careers"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Target role
    target_role: Mapped[str] = mapped_column(String(200), nullable=False)
    target_industry: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # Salary expectations
    target_salary_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    target_salary_max: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    
    # Location preferences
    preferred_locations: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    remote_preference: Mapped[RemotePreference] = mapped_column(Enum(RemotePreference), default=RemotePreference.ANY, nullable=False)
    
    # Job preferences
    preferred_company_sizes: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)  # startup, small, medium, large, enterprise
    preferred_company_types: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)  # tech, finance, healthcare, etc.
    
    # Timeline
    availability: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # immediately, 2 weeks, 1 month, etc.
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="target_career")
    
    def __repr__(self) -> str:
        return f"<TargetCareer(id={self.id}, target_role={self.target_role})>"
