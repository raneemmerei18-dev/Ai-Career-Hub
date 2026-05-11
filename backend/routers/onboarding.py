"""Onboarding API router."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user
from models.user import User


router = APIRouter()


class OnboardingStatusResponse(BaseModel):
    current_step: int
    completed_steps: List[int]
    is_complete: bool


class CompleteStepRequest(BaseModel):
    step: int
    data: dict


@router.get("/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's onboarding status."""
    # In a full implementation, this would fetch from a separate onboarding state table
    # For now, we'll return a basic status based on profile completion
    
    is_complete = current_user.onboarding_completed
    
    return OnboardingStatusResponse(
        current_step=8 if is_complete else 1,
        completed_steps=list(range(1, 9)) if is_complete else [],
        is_complete=is_complete
    )


@router.post("/complete-step")
async def complete_step(
    request: CompleteStepRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Complete an onboarding step and save data."""
    # In a full implementation, this would save step data to appropriate tables
    # based on the step number (profile, skills, experience, etc.)
    
    return {
        "success": True,
        "message": f"Step {request.step} completed",
        "next_step": request.step + 1 if request.step < 8 else None
    }


@router.post("/complete")
async def complete_onboarding(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark onboarding as complete."""
    current_user.onboarding_completed = True
    await db.commit()
    
    return {
        "success": True,
        "message": "Onboarding completed successfully"
    }


@router.post("/skip")
async def skip_onboarding(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Skip remaining onboarding steps."""
    current_user.onboarding_completed = True
    await db.commit()
    
    return {
        "success": True,
        "message": "Onboarding skipped"
    }
