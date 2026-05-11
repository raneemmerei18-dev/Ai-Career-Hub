#!/usr/bin/env python
"""
Comprehensive Backend Audit Script
Tests all critical functionality and identifies issues
"""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))


async def test_imports():
    """Test all critical imports."""
    print("\n" + "="*60)
    print("1. TESTING IMPORTS")
    print("="*60)
    
    try:
        from core.config import settings
        print("[OK] Config module imports successfully")
        print(f"   - Environment: {settings.ENVIRONMENT}")
        print(f"   - Database: {settings.DATABASE_URL[:50]}...")
        print(f"   - API Host: {settings.API_HOST}:{settings.API_PORT}")
    except Exception as e:
        print(f"[FAIL] Config import failed: {e}")
        return False
    
    try:
        from core.database import Base, get_engine, init_db
        print("[OK] Database module imports successfully")
    except Exception as e:
        print(f"[FAIL] Database import failed: {e}")
        return False
    
    try:
        from core.security import (
            hash_password, verify_password,
            create_access_token, decode_token,
            get_current_user
        )
        print("[OK] Security module imports successfully")
    except Exception as e:
        print(f"[FAIL] Security import failed: {e}")
        return False
    
    try:
        from models.user import User, UserRole
        from models.profile import Profile
        from models.subscription import Subscription
        print("[OK] All model imports successful")
    except Exception as e:
        print(f"[FAIL] Model import failed: {e}")
        return False
    
    try:
        from routers.auth import router as auth_router
        from routers.profile import router as profile_router
        from routers.skills import router as skills_router
        print("[OK] All router imports successful")
    except Exception as e:
        print(f"[FAIL] Router import failed: {e}")
        return False
    
    return True


async def test_database_connection():
    """Test database connectivity."""
    print("\n" + "="*60)
    print("2. TESTING DATABASE CONNECTION")
    print("="*60)
    
    try:
        from core.database import get_engine
        engine = get_engine()
        
        async with engine.connect() as conn:
            result = await conn.execute(__import__('sqlalchemy').text('SELECT 1'))
            print("[OK] Database connection successful")
            
            # Check if tables exist
            result = await conn.execute(
                __import__('sqlalchemy').text(
                    'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA="ai_career_hub"'
                )
            )
            tables = result.fetchall()
            print(f"[OK] Found {len(tables)} tables in database:")
            for table in tables:
                print(f"   - {table[0]}")
            
            # Check sample data
            result = await conn.execute(
                __import__('sqlalchemy').text('SELECT COUNT(*) FROM users')
            )
            user_count = result.scalar()
            print(f"Users in database: {user_count}")
            
            return True
    except Exception as e:
        print(f"[FAIL] Database connection failed: {e}")
        print(f"   Debug: {type(e).__name__}")
        return False


async def test_auth_flow():
    """Test authentication flow."""
    print("\n" + "="*60)
    print("3. TESTING AUTHENTICATION FLOW")
    print("="*60)
    
    try:
        from core.security import (
            hash_password, verify_password,
            create_access_token, decode_token
        )
        
        # Test password hashing
        password = "test_password_123"
        hashed = hash_password(password)
        print("[OK] Password hashing works")
        
        if verify_password(password, hashed):
            print("[OK] Password verification works")
        else:
            print("[FAIL] Password verification failed")
            return False
        
        # Test token creation
        token_data = {"sub": "test-user-id"}
        token = create_access_token(token_data)
        print("[OK] Access token creation works")
        
        # Test token decoding
        payload = decode_token(token)
        if payload.get("sub") == "test-user-id":
            print("[OK] Token decoding works")
        else:
            print("[FAIL] Token decoding returned unexpected payload")
            return False
        
        return True
    except Exception as e:
        print(f"[FAIL] Auth flow test failed: {e}")
        return False


async def test_models():
    """Test model instantiation."""
    print("\n" + "="*60)
    print("4. TESTING DATA MODELS")
    print("="*60)
    
    try:
        from models.user import User, UserRole
        from datetime import datetime
        import uuid
        
        # Create user instance (not saved)
        user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            password_hash="hashed_password",
            first_name="Test",
            last_name="User",
            role=UserRole.USER,
            is_active=True,
            is_verified=False,
            onboarding_completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        print("[OK] User model instantiation works")
        print(f"   - Full name: {user.full_name}")
        print(f"   - Role: {user.role.value}")
        
        from models.profile import Profile
        profile = Profile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            headline="Software Engineer"
        )
        print("[OK] Profile model instantiation works")
        
        return True
    except Exception as e:
        print(f"[FAIL] Model test failed: {e}")
        return False


async def test_api_app():
    """Test API app instantiation."""
    print("\n" + "="*60)
    print("5. TESTING API APP")
    print("="*60)
    
    try:
        from main import app
        
        print("[OK] FastAPI app instantiated successfully")
        print(f"   - Title: {app.title}")
        print(f"   - Version: {app.version}")
        print(f"   - Routes: {len(app.routes)} registered")
        
        # Check if important routes are registered
        routes = [route.path for route in app.routes]
        critical_routes = [
            "/health",
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/profile",
        ]
        
        for route in critical_routes:
            if route in routes:
                print(f"   [OK] {route}")
            else:
                print(f"   [MISSING] {route}")
        
        return True
    except Exception as e:
        print(f"[FAIL] API app test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def run_audit():
    """Run all audit tests."""
    print("\n")
    print("=" * 60)
    print("AI CAREER HUB - BACKEND AUDIT".center(60))
    print("=" * 60)
    
    results = {
        "Imports": await test_imports(),
        "Database": await test_database_connection(),
        "Auth Flow": await test_auth_flow(),
        "Models": await test_models(),
        "API App": await test_api_app(),
    }
    
    print("\n" + "="*60)
    print("AUDIT SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "[PASS]" if result else "[FAIL]"
        print(f"{test_name:.<40} {status}")
    
    print(f"\nScore: {passed}/{total} tests passed ({passed*100//total}%)")
    
    if passed == total:
        print("\nAll critical tests passed. Backend is operational.")
        exit_code = 0
    else:
        print(f"\n{total - passed} tests failed. See details above.")
        exit_code = 1

    from core.database import get_engine
    await get_engine().dispose()
    return exit_code


if __name__ == "__main__":
    exit_code = asyncio.run(run_audit())
    sys.exit(exit_code)
