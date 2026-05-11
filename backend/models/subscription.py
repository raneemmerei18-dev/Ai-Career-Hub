"""Subscription model for user plans and billing."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from core.database import Base
from models.utils import utc_now
if TYPE_CHECKING:
    from models.user import User


class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    PAST_DUE = "past_due"
    TRIALING = "trialing"
    PAUSED = "paused"


class Subscription(Base):
    """User subscription for premium features."""
    
    __tablename__ = "subscriptions"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Plan details
    plan: Mapped[SubscriptionPlan] = mapped_column(Enum(SubscriptionPlan), default=SubscriptionPlan.FREE, nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(Enum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE, nullable=False)
    
    # Billing cycle
    current_period_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    current_period_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # External billing reference (e.g., Stripe)
    external_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    external_customer_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    # Feature limits
    features: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    
    # Usage tracking
    ai_requests_used: Mapped[int] = mapped_column(default=0, nullable=False)
    resumes_created: Mapped[int] = mapped_column(default=0, nullable=False)
    interviews_taken: Mapped[int] = mapped_column(default=0, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="subscription")
    
    @property
    def is_premium(self) -> bool:
        """Check if user has premium subscription."""
        return self.plan in [SubscriptionPlan.PRO, SubscriptionPlan.ENTERPRISE] and self.status == SubscriptionStatus.ACTIVE
    
    def __repr__(self) -> str:
        return f"<Subscription(id={self.id}, plan={self.plan}, status={self.status})>"
