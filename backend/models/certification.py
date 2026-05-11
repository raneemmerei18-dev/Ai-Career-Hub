"""Certification model for professional certifications."""

from datetime import datetime, date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from models.profile import Profile


class Certification(Base):
    """Professional certification entry."""
    
    __tablename__ = "certifications"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # Certification info
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    issuing_organization: Mapped[str] = mapped_column(String(200), nullable=False)
    organization_logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Dates
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    expiration_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    # Credential info
    credential_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    credential_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Order for display
    display_order: Mapped[int] = mapped_column(default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="certifications")
    
    @property
    def is_expired(self) -> bool:
        """Check if the certification has expired."""
        if not self.expiration_date:
            return False
        return date.today() > self.expiration_date
    
    def __repr__(self) -> str:
        return f"<Certification(id={self.id}, name={self.name})>"
