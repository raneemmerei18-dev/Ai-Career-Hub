"""Resume model for user resumes."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from models.utils import utc_now
if TYPE_CHECKING:
    from models.user import User


class Resume(Base):
    """Resume document with content and metadata."""
    
    __tablename__ = "resumes"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Resume info
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    template_id: Mapped[str] = mapped_column(String(100), default="modern", nullable=False)
    
    # Content (structured JSON)
    content: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    
    # ATS Analysis
    ats_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ats_analysis: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Version control
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    parent_version_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    public_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # File exports
    pdf_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    docx_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="resumes")
    
    def __repr__(self) -> str:
        return f"<Resume(id={self.id}, name={self.name}, version={self.version})>"
