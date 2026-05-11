"""Job model for job listings."""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Integer, DateTime, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column
import enum

from core.database import Base


class EmploymentType(str, enum.Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class RemoteType(str, enum.Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"


class Job(Base):
    """Job listing from various sources."""
    
    __tablename__ = "jobs"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    
    # Basic info
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    company: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    company_logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Location
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    remote_type: Mapped[RemoteType] = mapped_column(Enum(RemoteType), default=RemoteType.ONSITE, nullable=False)
    
    # Job details
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirements: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    responsibilities: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    benefits: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Employment
    employment_type: Mapped[EmploymentType] = mapped_column(Enum(EmploymentType), default=EmploymentType.FULL_TIME, nullable=False)
    experience_level: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # entry, mid, senior, lead, executive
    
    # Salary
    salary_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    salary_period: Mapped[str] = mapped_column(String(20), default="yearly", nullable=False)  # yearly, monthly, hourly
    
    # Skills
    required_skills: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    preferred_skills: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Source
    source: Mapped[str] = mapped_column(String(100), nullable=False)  # linkedin, adzuna, jsearch, manual
    source_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    source_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # Dates
    posted_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @property
    def is_expired(self) -> bool:
        """Check if the job listing has expired."""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at
    
    def __repr__(self) -> str:
        return f"<Job(id={self.id}, title={self.title}, company={self.company})>"
