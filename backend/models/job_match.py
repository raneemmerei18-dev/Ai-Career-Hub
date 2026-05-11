"""Job match model for user-job matching."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Text, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base

if TYPE_CHECKING:
    from models.user import User
    from models.job import Job


class JobMatchStatus(str, enum.Enum):
    NEW = "new"
    SAVED = "saved"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class JobMatch(Base):
    """User-Job match with scoring and tracking."""
    
    __tablename__ = "job_matches"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    
    # Match scoring
    match_score: Mapped[float] = mapped_column(Float, nullable=False)
    matched_skills: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    missing_skills: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    match_details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Application status
    status: Mapped[JobMatchStatus] = mapped_column(Enum(JobMatchStatus), default=JobMatchStatus.NEW, nullable=False)
    
    # Application tracking
    applied_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    resume_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    cover_letter_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    # Notes and tracking
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    next_step: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    next_step_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="job_matches")
    job: Mapped["Job"] = relationship("Job")
    
    def __repr__(self) -> str:
        return f"<JobMatch(id={self.id}, user_id={self.user_id}, job_id={self.job_id}, score={self.match_score})>"
