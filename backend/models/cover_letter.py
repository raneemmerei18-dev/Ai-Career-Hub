"""Cover letter model for job applications."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from models.utils import utc_now
if TYPE_CHECKING:
    from models.user import User
    from models.job import Job


class CoverLetter(Base):
    """Cover letter document."""
    
    __tablename__ = "cover_letters"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    
    # Cover letter info
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Target info (for AI context)
    target_company: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    target_role: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # File exports
    pdf_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="cover_letters")
    job: Mapped[Optional["Job"]] = relationship("Job")
    
    def __repr__(self) -> str:
        return f"<CoverLetter(id={self.id}, name={self.name})>"
