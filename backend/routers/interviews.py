"""Interviews API router."""

from typing import List, Optional
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.interview import InterviewSession, InterviewType, Difficulty, SessionStatus


router = APIRouter()


class CreateSessionRequest(BaseModel):
    job_id: Optional[str] = None
    type: str = "mixed"
    difficulty: str = "medium"
    target_role: Optional[str] = None


class SessionResponse(BaseModel):
    id: str
    type: str
    difficulty: str
    status: str
    target_role: Optional[str]
    score: Optional[float]
    created_at: str


@router.get("/sessions")
async def get_sessions(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's interview sessions."""
    stmt = select(InterviewSession).where(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc())
    
    result = await db.execute(stmt)
    sessions = result.scalars().all()
    
    return {
        "data": [SessionResponse(
            id=s.id,
            type=s.type.value,
            difficulty=s.difficulty.value,
            status=s.status.value,
            target_role=s.target_role,
            score=s.score,
            created_at=s.created_at.isoformat()
        ) for s in sessions],
        "total": len(sessions),
        "page": page,
        "page_size": page_size,
        "total_pages": 1
    }

@router.get("/sessions/{session_id}")
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific interview session with questions."""
    from models.interview import InterviewSession
    stmt = select(InterviewSession).where(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).options(selectinload(InterviewSession.questions))
    
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {
        "id": session.id,
        "type": session.type.value,
        "difficulty": session.difficulty.value,
        "target_role": session.target_role,
        "status": session.status.value,
        "questions": [{
            "id": q.id,
            "question": q.question,
            "type": q.type.value,
            "tips": q.hints
        } for q in sorted(session.questions, key=lambda x: x.order)]
    }


from services.ai_service import ai_service
from models.profile import Profile
from models.skill import UserSkill, Skill
from models.interview import InterviewQuestion, InterviewType, Difficulty, SessionStatus
from sqlalchemy.orm import selectinload

@router.post("/sessions")
async def create_session(
    request: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new interview session with AI-generated questions."""
    # 1. Fetch user data for personalization
    profile_stmt = select(Profile).where(Profile.user_id == current_user.id)
    profile_result = await db.execute(profile_stmt)
    profile = profile_result.scalar_one_or_none()
    
    skills = []
    if profile:
        skills_stmt = select(Skill.name).join(UserSkill).where(UserSkill.profile_id == profile.id)
        skills_result = await db.execute(skills_stmt)
        skills = [row[0] for row in skills_result.all()]

    # 2. Generate questions using Groq
    target_role = request.target_role or (profile.headline if profile else "Software Engineer")
    ai_data = await ai_service.generate_interview_questions(
        job_title=target_role,
        company="a top tech company",
        skills=skills[:10]  # Limit to top 10 skills
    )
    
    # 3. Create session record
    session = InterviewSession(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        job_id=request.job_id,
        type=InterviewType(request.type) if request.type in [t.value for t in InterviewType] else InterviewType.MIXED,
        difficulty=Difficulty(request.difficulty) if request.difficulty in [d.value for d in Difficulty] else Difficulty.MEDIUM,
        target_role=target_role,
        status=SessionStatus.PENDING
    )
    
    db.add(session)
    
    # 4. Create question records
    db_questions = []
    for i, q in enumerate(ai_data.get("questions", [])):
        question = InterviewQuestion(
            id=str(uuid.uuid4()),
            session_id=session.id,
            question=q["question"],
            type=InterviewType(q["type"]) if q["type"] in [t.value for t in InterviewType] else InterviewType.BEHAVIORAL,
            difficulty=session.difficulty,
            order=i,
            hints=q.get("tips", [])
        )
        db.add(question)
        db_questions.append(question)
    
    await db.commit()
    await db.refresh(session)
    
    return {
        "id": session.id,
        "type": session.type.value,
        "difficulty": session.difficulty.value,
        "target_role": session.target_role,
        "status": session.status.value,
        "questions": [{
            "id": q.id,
            "question": q.question,
            "type": q.type.value,
            "tips": q.hints
        } for q in db_questions]
    }


class SubmitAnswerRequest(BaseModel):
    question_id: str
    answer: str
    time_taken_seconds: Optional[int] = None

@router.post("/sessions/{session_id}/answers")
async def submit_answer(
    session_id: str,
    request: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit an answer for evaluation by Groq AI."""
    from models.interview import InterviewAnswer, InterviewQuestion
    
    # 1. Verify session and question
    session_stmt = select(InterviewSession).where(
        InterviewSession.id == session_id, 
        InterviewSession.user_id == current_user.id
    ).options(selectinload(InterviewSession.questions))
    session_result = await db.execute(session_stmt)
    session = session_result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    question_stmt = select(InterviewQuestion).where(InterviewQuestion.id == request.question_id)
    question_result = await db.execute(question_stmt)
    question = question_result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # 2. Evaluate with AI
    evaluation = await ai_service.evaluate_interview_answer(
        question=question.question,
        answer=request.answer,
        target_role=session.target_role or "Software Engineer"
    )

    # 3. Save answer
    answer = InterviewAnswer(
        id=str(uuid.uuid4()),
        session_id=session.id,
        question_id=question.id,
        answer=request.answer,
        score=evaluation.get("score"),
        feedback=evaluation.get("feedback"),
        strengths=evaluation.get("strengths", []),
        improvements=evaluation.get("improvements", []),
        time_taken_seconds=request.time_taken_seconds
    )
    db.add(answer)

    # 4. Check if session is completed
    # Simple logic: if this is the last question or we want to mark it as in-progress
    session.status = SessionStatus.IN_PROGRESS
    if session.started_at is None:
        session.started_at = datetime.utcnow()
    
    # Update total score if session is finishing (simplified)
    # In a real app, you'd check if all questions are answered
    
    await db.commit()
    await db.refresh(answer)

    return {
        "success": True,
        "data": {
            "id": answer.id,
            "score": answer.score,
            "feedback": answer.feedback,
            "strengths": answer.strengths,
            "improvements": answer.improvements,
            "model_answer": evaluation.get("model_answer")
        }
    }

@router.get("/stats")
async def get_interview_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get interview statistics."""
    result = await db.execute(
        select(InterviewSession).where(InterviewSession.user_id == current_user.id)
    )
    sessions = result.scalars().all()
    
    completed = [s for s in sessions if s.status == SessionStatus.COMPLETED]
    
    return {
        "total_sessions": len(sessions),
        "completed_sessions": len(completed),
        "average_score": sum(s.score or 0 for s in completed) / len(completed) if completed else 0,
        "scores_by_type": {},
        "recent_progress": []
    }
