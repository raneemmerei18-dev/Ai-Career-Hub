"""Language model for spoken languages."""

from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base

if TYPE_CHECKING:
    from models.profile import Profile


class LanguageProficiency(str, enum.Enum):
    BASIC = "basic"
    CONVERSATIONAL = "conversational"
    PROFESSIONAL = "professional"
    NATIVE = "native"


class Language(Base):
    """Spoken language entry."""
    
    __tablename__ = "languages"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # Language info
    language: Mapped[str] = mapped_column(String(100), nullable=False)
    proficiency: Mapped[LanguageProficiency] = mapped_column(Enum(LanguageProficiency), nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="languages")
    
    def __repr__(self) -> str:
        return f"<Language(id={self.id}, language={self.language}, proficiency={self.proficiency})>"
