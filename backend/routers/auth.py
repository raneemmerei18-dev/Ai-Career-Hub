"""Authentication API router."""

from datetime import datetime, timezone
from models.utils import utc_now
import uuid
from typing import Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
import json
from urllib.parse import urlencode
from urllib.request import Request as UrlRequest, urlopen

from core.database import get_db
from core.config import settings
from core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user, create_verification_token, create_password_reset_token
)
from models.user import User, UserRole
from models.profile import Profile
from models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus


router = APIRouter()


# Request/Response schemas
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100, validation_alias="firstName")
    last_name: str = Field(min_length=1, max_length=100, validation_alias="lastName")
    
    model_config = ConfigDict(populate_by_name=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    expiresAt: int
    tokenType: str = "bearer"


class TokenDataResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: TokenResponse


class UserResponse(BaseModel):
    id: str
    email: str
    firstName: str = Field(validation_alias="first_name")
    lastName: str = Field(validation_alias="last_name")
    avatar: Optional[str] = None
    role: str
    isVerified: bool = Field(validation_alias="is_verified")
    onboardingCompleted: bool = Field(validation_alias="onboarding_completed")
    createdAt: datetime = Field(validation_alias="created_at")
    updatedAt: datetime = Field(validation_alias="updated_at")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class UserDataResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: UserResponse


class AuthData(BaseModel):
    user: UserResponse
    tokens: TokenResponse


class AuthResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: AuthData


class RefreshRequest(BaseModel):
    refresh_token: str = Field(validation_alias="refreshToken")
    
    model_config = ConfigDict(populate_by_name=True)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=8)
    confirm_password: str = Field(validation_alias="confirmPassword")
    
    model_config = ConfigDict(populate_by_name=True)


class VerifyEmailRequest(BaseModel):
    token: str


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(validation_alias="currentPassword")
    new_password: str = Field(min_length=8, validation_alias="newPassword")
    
    model_config = ConfigDict(populate_by_name=True)


class SocialLoginRequest(BaseModel):
    provider: Literal["google", "github", "linkedin"]


class SocialLoginResponse(BaseModel):
    url: str


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    print(f"Registering user: {request.email}, {request.first_name} {request.last_name}")
    from sqlalchemy import select
    
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == request.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        print(f"Registration failed: Email {request.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=request.email,
        password_hash=hash_password(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        role=UserRole.user,
        is_active=True,
        is_verified=False,
        onboarding_completed=False,
    )
    db.add(user)
    
    # Create empty profile
    profile = Profile(
        id=str(uuid.uuid4()),
        user_id=user_id,
    )
    db.add(profile)
    
    # Create free subscription
    subscription = Subscription(
        id=str(uuid.uuid4()),
        user_id=user_id,
        plan=SubscriptionPlan.FREE,
        status=SubscriptionStatus.ACTIVE,
        current_period_start=utc_now(),
        current_period_end=utc_now(),
        features={
            "ai_requests_limit": 50,
            "resumes_limit": 3,
            "interviews_limit": 10,
        }
    )
    db.add(subscription)
    
    await db.commit()
    await db.refresh(user)
    
    # Generate tokens
    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})
    
    return AuthResponse(
        data=AuthData(
            user=UserResponse(
                id=user.id,
                email=user.email,
                firstName=user.first_name,
                lastName=user.last_name,
                avatar=user.avatar_url,
                role=user.role.value,
                isVerified=user.is_verified,
                onboardingCompleted=user.onboarding_completed,
                createdAt=user.created_at,
                updatedAt=user.updated_at,
            ),
            tokens=TokenResponse(
                accessToken=access_token,
                refreshToken=refresh_token,
                expiresAt=int((datetime.now(timezone.utc)).timestamp()) + 1800,
            )
        )
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    from sqlalchemy import select
    
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended"
        )
    
    # Update last login
    user.last_login_at = utc_now()
    await db.commit()
    await db.refresh(user)
    
    # Generate tokens
    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})
    
    return AuthResponse(
        data=AuthData(
            user=UserResponse(
                id=user.id,
                email=user.email,
                firstName=user.first_name,
                lastName=user.last_name,
                avatar=user.avatar_url,
                role=user.role.value,
                isVerified=user.is_verified,
                onboardingCompleted=user.onboarding_completed,
                createdAt=user.created_at,
                updatedAt=user.updated_at,
            ),
            tokens=TokenResponse(
                accessToken=access_token,
                refreshToken=refresh_token,
                expiresAt=int((datetime.now(timezone.utc)).timestamp()) + 1800,
            )
        )
    )


@router.post("/refresh", response_model=TokenDataResponse)
async def refresh_tokens(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token."""
    from sqlalchemy import select
    
    payload = decode_token(request.refresh_token)
    
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})
    
    return TokenDataResponse(
        data=TokenResponse(
            accessToken=access_token,
            refreshToken=refresh_token,
            expiresAt=int((datetime.now(timezone.utc)).timestamp()) + 1800,
        )
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout current user (invalidate tokens client-side)."""
    # In a production system, you might want to blacklist the token
    return {"success": True, "message": "Logged out successfully"}


@router.get("/me", response_model=UserDataResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information."""
    return UserDataResponse(
        data=UserResponse(
            id=current_user.id,
            email=current_user.email,
            firstName=current_user.first_name,
            lastName=current_user.last_name,
            avatar=current_user.avatar_url,
            role=current_user.role.value,
            isVerified=current_user.is_verified,
            onboardingCompleted=current_user.onboarding_completed,
            createdAt=current_user.created_at,
            updatedAt=current_user.updated_at,
        )
    )


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Request password reset email."""
    from sqlalchemy import select
    
    # Always return success to prevent email enumeration
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    
    if user:
        token = create_password_reset_token(user.email)
        # In production, send email with reset link
        # background_tasks.add_task(send_reset_email, user.email, token)
    
    return {"success": True, "message": "If an account exists, a reset email has been sent"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset password using reset token."""
    from sqlalchemy import select
    
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    payload = decode_token(request.token)
    
    if payload.get("type") != "reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )
    
    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )
    
    user.password_hash = hash_password(request.password)
    await db.commit()
    
    return {"success": True, "message": "Password reset successfully"}


@router.post("/verify-email")
async def verify_email(request: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    """Verify user email using verification token."""
    from sqlalchemy import select
    
    payload = decode_token(request.token)
    
    if payload.get("type") != "verify":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    user.is_verified = True
    await db.commit()
    
    return {"success": True, "message": "Email verified successfully"}


@router.post("/change-password")
async def change_password(request: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Change user password."""
    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.password_hash = hash_password(request.new_password)
    await db.commit()
    
    return {"success": True, "message": "Password changed successfully"}


@router.post("/social-login", response_model=SocialLoginResponse)
async def social_login(request: SocialLoginRequest, http_request: Request):
    """Start social login flow by returning provider authorization URL."""
    if request.provider != "google":
        raise HTTPException(status_code=400, detail=f"{request.provider} login is not configured yet")

    if not settings.GOOGLE_CLIENT_ID:
        frontend_origin = settings.FRONTEND_URL or http_request.headers.get("origin") or "http://localhost:3000"
        return SocialLoginResponse(
            url=f"{frontend_origin}/auth/login?social=error&reason=google_oauth_not_configured"
        )

    auth_params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(auth_params)}"
    return SocialLoginResponse(url=auth_url)


@router.get("/social-callback/google")
async def social_callback_google(code: Optional[str] = None, error: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback, then redirect to frontend with app tokens."""
    frontend_login_url = f"{settings.FRONTEND_URL}/auth/login"

    if error:
        return RedirectResponse(url=f"{frontend_login_url}?social=error&reason={error}", status_code=302)

    if not code:
        return RedirectResponse(url=f"{frontend_login_url}?social=error&reason=missing_code", status_code=302)

    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        return RedirectResponse(url=f"{frontend_login_url}?social=error&reason=oauth_not_configured", status_code=302)

    try:
        token_body = urlencode(
            {
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            }
        ).encode("utf-8")

        token_req = UrlRequest(
            url="https://oauth2.googleapis.com/token",
            data=token_body,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST",
        )
        with urlopen(token_req, timeout=30) as token_resp:
            token_data = json.loads(token_resp.read().decode("utf-8"))

        google_access_token = token_data.get("access_token")

        if not google_access_token:
            return RedirectResponse(url=f"{frontend_login_url}?social=error&reason=no_google_access_token", status_code=302)

        userinfo_req = UrlRequest(
            url="https://openidconnect.googleapis.com/v1/userinfo",
            headers={"Authorization": f"Bearer {google_access_token}"},
            method="GET",
        )
        with urlopen(userinfo_req, timeout=30) as userinfo_resp:
            google_user = json.loads(userinfo_resp.read().decode("utf-8"))

        email = google_user.get("email")
        if not email:
            return RedirectResponse(url=f"{frontend_login_url}?social=error&reason=no_email", status_code=302)

        first_name = google_user.get("given_name") or "Google"
        last_name = google_user.get("family_name") or "User"
        avatar_url = google_user.get("picture")

        from sqlalchemy import select
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            user_id = str(uuid.uuid4())
            user = User(
                id=user_id,
                email=email,
                password_hash=hash_password(uuid.uuid4().hex),
                first_name=first_name,
                last_name=last_name,
                avatar_url=avatar_url,
                role=UserRole.user,
                is_active=True,
                is_verified=True,
                onboarding_completed=False,
            )
            db.add(user)

            profile = Profile(
                id=str(uuid.uuid4()),
                user_id=user_id,
                github_url=None,
            )
            db.add(profile)

            subscription = Subscription(
                id=str(uuid.uuid4()),
                user_id=user_id,
                plan=SubscriptionPlan.FREE,
                status=SubscriptionStatus.ACTIVE,
                current_period_start=utc_now(),
                current_period_end=utc_now(),
                features={
                    "ai_requests_limit": 50,
                    "resumes_limit": 3,
                    "interviews_limit": 10,
                },
            )
            db.add(subscription)
        else:
            if not user.avatar_url and avatar_url:
                user.avatar_url = avatar_url
            if not user.is_verified:
                user.is_verified = True

        await db.commit()
        await db.refresh(user)

        access_token = create_access_token({"sub": user.id})
        refresh_token = create_refresh_token({"sub": user.id})

        redirect_query = urlencode({
            "accessToken": access_token,
            "refreshToken": refresh_token,
        })
        return RedirectResponse(url=f"{frontend_login_url}?{redirect_query}", status_code=302)

    except Exception:
        return RedirectResponse(url=f"{frontend_login_url}?social=error&reason=oauth_exchange_failed", status_code=302)
