"""Experience model for work history."""

from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Date, DateTime, ForeignKey, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from models.profile import Profile


class Experience(Base):
    """Work experience entry."""
    
    __tablename__ = "experiences"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # Company info
    company: Mapped[str] = mapped_column(String(200), nullable=False)
    company_logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Position info
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    employment_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # full-time, part-time, contract, etc.
    location: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    is_remote: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Duration
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Description
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    achievements: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    technologies: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    
    # Order for display
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="experiences")
    
    def __repr__(self) -> str:
        return f"<Experience(id={self.id}, company={self.company}, title={self.title})>"
