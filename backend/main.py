"""
AI Career Hub - FastAPI Backend
Production-grade API for the AI-powered career operating system.
"""

import platform
import sys
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

# Add the current directory to sys.path to ensure module resolution works correctly
# when running from different parent directories.
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import fastapi
import fastapi.middleware.cors
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler for startup/shutdown events."""
    # Startup
    print("Starting AI Career Hub API...")
    # Initialize database lazily when needed
    from core.database import init_db
    try:
        await init_db()
    except Exception as e:
        print(f"Database initialization skipped: {e}")
    yield
    # Shutdown
    print("Shutting down AI Career Hub API...")


app = FastAPI(
    title="AI Career Hub API",
    description="Production-grade API for the AI-powered career operating system",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS Middleware
# Normalize CORS origins into a list and determine credentials policy
_cors_origins = settings.CORS_ORIGINS
if isinstance(_cors_origins, str):
    _cors_origins = [o.strip() for o in _cors_origins.split(",") if o.strip()]

# If wildcard origin is present, browsers disallow credentials
_allow_credentials = False if "*" in _cors_origins else True

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard Response Wrapper Middleware
@app.middleware("http")
async def wrap_api_responses(request: fastapi.Request, call_next):
    """Wrap all API responses in a standard {success: true, data: ...} envelope."""
    response = await call_next(request)
    
    # Only wrap successful JSON responses from API v1
    if (
        request.url.path.startswith("/api/v1") and 
        response.status_code < 400 and
        "application/json" in response.headers.get("content-type", "")
    ):
        import json
        from fastapi.responses import Response
        from starlette.concurrency import iterate_in_threadpool
        
        # Capture the response body
        response_body = [chunk async for chunk in response.body_iterator]
        response.body_iterator = iterate_in_threadpool(iter(response_body))
        body = b"".join(response_body)
            
        try:
            data = json.loads(body)
            # If already wrapped, don't wrap again
            if isinstance(data, dict) and "success" in data:
                return response
            
            wrapped_data = {
                "success": True,
                "message": None,
                "data": data
            }
            new_content = json.dumps(wrapped_data).encode("utf-8")
            
            # Create a new response with the wrapped content
            new_response = Response(
                content=new_content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type="application/json"
            )
            # Update content length header
            new_response.headers["Content-Length"] = str(len(new_content))
            return new_response
        except Exception:
            return response

    if response.status_code == 400:
        print(f"400 Error for {request.method} {request.url.path}")
            
    return response


# Health check endpoint
@app.get("/health")
async def health() -> dict[str, str]:
    """Health check endpoint for load balancers and monitoring."""
    return {"status": "healthy", "service": "ai-career-hub-api", "version": "1.0.0"}


# API Version endpoint
@app.get("/version")
async def version() -> dict[str, str]:
    """Get API version information."""
    return {
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "python_version": platform.python_version(),
    }


# Include routers with API versioning prefix
api_v1_prefix = "/api/v1"

# Import routers lazily to avoid circular dependencies
from routers.auth import router as auth_router
from routers.profile import router as profile_router
from routers.onboarding import router as onboarding_router
from routers.skills import router as skills_router
from routers.resumes import router as resumes_router
from routers.cover_letters import router as cover_letters_router
from routers.jobs import router as jobs_router
from routers.interviews import router as interviews_router
from routers.ai_analysis import router as ai_analysis_router
from routers.notifications import router as notifications_router
from routers.learning_paths import router as learning_paths_router
from routers.admin import router as admin_router

app.include_router(auth_router, prefix=f"{api_v1_prefix}/auth", tags=["Authentication"])
app.include_router(profile_router, prefix=f"{api_v1_prefix}/profile", tags=["Profile"])
app.include_router(onboarding_router, prefix=f"{api_v1_prefix}/onboarding", tags=["Onboarding"])
app.include_router(skills_router, prefix=f"{api_v1_prefix}/skills", tags=["Skills"])
app.include_router(resumes_router, prefix=f"{api_v1_prefix}/resumes", tags=["Resumes"])
app.include_router(cover_letters_router, prefix=f"{api_v1_prefix}/cover-letters", tags=["Cover Letters"])
app.include_router(jobs_router, prefix=f"{api_v1_prefix}/jobs", tags=["Jobs"])
app.include_router(interviews_router, prefix=f"{api_v1_prefix}/interviews", tags=["Interviews"])
app.include_router(ai_analysis_router, prefix=f"{api_v1_prefix}/ai", tags=["AI Analysis"])
app.include_router(notifications_router, prefix=f"{api_v1_prefix}/notifications", tags=["Notifications"])
app.include_router(learning_paths_router, prefix=f"{api_v1_prefix}/learning-paths", tags=["Learning Paths"])
app.include_router(admin_router, prefix=f"{api_v1_prefix}/admin", tags=["Admin"])


# Dashboard stats endpoint
@app.get("/api/v1/dashboard/stats")
async def dashboard_stats():
    """Get dashboard statistics for authenticated user."""
    # This would normally fetch from database
    return {
        "atsScore": 78,
        "matchScore": 82,
        "interviewReadiness": 65,
        "profileCompleteness": 90,
        "activeApplications": 12,
        "savedJobs": 24,
        "completedInterviews": 5,
        "learningProgress": 45,
    }


@app.get("/api/v1/dashboard/quick-actions")
async def quick_actions():
    """Get quick action suggestions for dashboard."""
    return {
        "missingSkills": ["TypeScript", "AWS", "Docker"],
        "pendingInterviews": 2,
        "unreadNotifications": 5,
        "resumeSuggestions": [
            "Add more quantifiable achievements",
            "Include recent project links",
        ],
    }


@app.get("/api/v1/dashboard/insights")
async def career_insights():
    """Get AI-powered career insights."""
    return {
        "insights": [
            {"title": "Strong Technical Profile", "description": "Your technical skills align well with senior developer roles", "type": "success"},
            {"title": "Missing Cloud Skills", "description": "Consider adding AWS or Azure certifications", "type": "warning"},
            {"title": "Portfolio Boost", "description": "Adding 2 more projects could increase match rates by 15%", "type": "tip"},
        ],
        "trendingSkills": ["AI/ML", "Kubernetes", "Rust", "TypeScript", "GraphQL"],
        "recommendedActions": [
            "Complete your AWS certification",
            "Update your resume with recent projects",
            "Practice system design interviews",
        ],
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: fastapi.Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    import traceback
    print(f"Unhandled exception: {exc}")
    traceback.print_exc()
    # Also write full traceback to a log file for easier debugging
    try:
        with open("server_errors.log", "a", encoding="utf-8") as f:
            f.write("\n--- Unhandled exception ---\n")
            traceback.print_exc(file=f)
            f.write("\n")
    except Exception:
        pass
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An internal server error occurred",
            "code": "INTERNAL_ERROR",
            "data": None
        },
    )


@app.exception_handler(fastapi.exceptions.RequestValidationError)
async def validation_exception_handler(request: fastapi.Request, exc: fastapi.exceptions.RequestValidationError):
    """Handler for validation errors."""
    print(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=400,  # Explicitly return 400 for validation errors as requested by frontend
        content={
            "success": False,
            "message": "Validation error",
            "code": "VALIDATION_ERROR",
            "data": exc.errors()
        },
    )
