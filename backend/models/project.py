"""Project model for portfolio projects."""

from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from models.utils import utc_now

if TYPE_CHECKING:
    from models.profile import Profile


class Project(Base):
    """Portfolio project entry."""
    
    __tablename__ = "projects"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # Project info
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Links
    url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    demo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Technical details
    technologies: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    highlights: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Duration
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    # Order for display
    display_order: Mapped[int] = mapped_column(default=0, nullable=False)
    is_featured: Mapped[bool] = mapped_column(default=False, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="projects")
    
    def __repr__(self) -> str:
        return f"<Project(id={self.id}, title={self.title})>"
