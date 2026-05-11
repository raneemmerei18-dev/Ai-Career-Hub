"""Interview models for practice sessions and answers."""

from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base

if TYPE_CHECKING:
    from models.user import User


class InterviewType(str, enum.Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    HR = "hr"
    SYSTEM_DESIGN = "system-design"
    MIXED = "mixed"


class Difficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class SessionStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class InterviewSession(Base):
    """Interview practice session."""
    
    __tablename__ = "interview_sessions"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    # Session config
    type: Mapped[InterviewType] = mapped_column(Enum(InterviewType), nullable=False)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), default=Difficulty.MEDIUM, nullable=False)
    target_role: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # Status
    status: Mapped[SessionStatus] = mapped_column(Enum(SessionStatus), default=SessionStatus.PENDING, nullable=False)
    
    # Results
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timing
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="interview_sessions")
    questions: Mapped[List["InterviewQuestion"]] = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan")
    answers: Mapped[List["InterviewAnswer"]] = relationship("InterviewAnswer", back_populates="session", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<InterviewSession(id={self.id}, type={self.type}, status={self.status})>"


class InterviewQuestion(Base):
    """Interview question within a session."""
    
    __tablename__ = "interview_questions"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    
    # Question details
    question: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[InterviewType] = mapped_column(Enum(InterviewType), nullable=False)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), default=Difficulty.MEDIUM, nullable=False)
    
    # Expected answer for evaluation
    expected_answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    hints: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    evaluation_criteria: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Order in session
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    session: Mapped["InterviewSession"] = relationship("InterviewSession", back_populates="questions")
    
    def __repr__(self) -> str:
        return f"<InterviewQuestion(id={self.id}, type={self.type})>"


class InterviewAnswer(Base):
    """User's answer to an interview question."""
    
    __tablename__ = "interview_answers"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("interview_questions.id", ondelete="CASCADE"), nullable=False)
    
    # Answer content
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    
    # AI evaluation
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    strengths: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    improvements: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    # Timing
    time_taken_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    session: Mapped["InterviewSession"] = relationship("InterviewSession", back_populates="answers")
    question: Mapped["InterviewQuestion"] = relationship("InterviewQuestion")
    
    def __repr__(self) -> str:
        return f"<InterviewAnswer(id={self.id}, score={self.score})>"
