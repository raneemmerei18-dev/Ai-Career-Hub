"""Education model for educational background."""

from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Date, DateTime, Float, ForeignKey, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from models.profile import Profile


class Education(Base):
    """Education entry."""
    
    __tablename__ = "education"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # Institution info
    institution: Mapped[str] = mapped_column(String(200), nullable=False)
    institution_logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # Degree info
    degree: Mapped[str] = mapped_column(String(100), nullable=False)
    field_of_study: Mapped[str] = mapped_column(String(200), nullable=False)
    
    # Duration
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Performance
    gpa: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    gpa_scale: Mapped[Optional[float]] = mapped_column(Float, default=4.0, nullable=True)
    
    # Additional info
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    achievements: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    activities: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    
    # Order for display
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="education")
    
    def __repr__(self) -> str:
        return f"<Education(id={self.id}, institution={self.institution}, degree={self.degree})>"
