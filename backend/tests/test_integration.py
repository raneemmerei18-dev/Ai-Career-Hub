import pytest
import uuid
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_db_state():
    from core import database
    database._engine = None
    database._async_session_maker = None
    yield

@pytest.fixture
def test_user_data():
    unique_id = str(uuid.uuid4())[:8]
    return {
        "email": f"test_{unique_id}@example.com",
        "password": "Password123!",
        "first_name": "Test",
        "last_name": "User"
    }

def test_full_auth_and_profile_flow(test_user_data):
    # 1. Register
    response = client.post("/api/v1/auth/register", json=test_user_data)
    assert response.status_code == 201
    payload = response.json()
    assert payload["success"] is True
    assert "data" in payload
    assert "tokens" in payload["data"]
    assert "user" in payload["data"]
    
    tokens = payload["data"]["tokens"]
    access_token = tokens["access_token"]
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 2. Get Current User
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["email"] == test_user_data["email"]
    
    # 3. Get Profile
    response = client.get("/api/v1/profile", headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert "data" in payload
    assert payload["data"]["user_id"] is not None
    
    # 4. Update Profile
    update_data = {"headline": "Senior QA Engineer", "location": "Remote"}
    response = client.patch("/api/v1/profile", json=update_data, headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["headline"] == "Senior QA Engineer"

def test_login_and_resume_flow(test_user_data):
    # Register first
    client.post("/api/v1/auth/register", json=test_user_data)
    
    # 1. Login
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    payload = response.json()
    access_token = payload["data"]["tokens"]["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 2. Get Resumes (Empty)
    response = client.get("/api/v1/resumes", headers=headers)
    assert response.status_code == 200
    assert len(response.json()["data"]) == 0
    
    # 3. Create Resume
    resume_data = {"name": "My AI Resume", "template_id": "modern"}
    response = client.post("/api/v1/resumes", json=resume_data, headers=headers)
    assert response.status_code == 201
    payload = response.json()
    assert payload["data"]["name"] == "My AI Resume"
    resume_id = payload["data"]["id"]
    
    # 4. Get Resumes (1)
    response = client.get("/api/v1/resumes", headers=headers)
    assert len(response.json()["data"]) == 1

def test_jobs_and_stats_flow(test_user_data):
    # Register and Login
    client.post("/api/v1/auth/register", json=test_user_data)
    login_data = {"email": test_user_data["email"], "password": test_user_data["password"]}
    response = client.post("/api/v1/auth/login", json=login_data)
    access_token = response.json()["data"]["tokens"]["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 1. Search Jobs
    response = client.get("/api/v1/jobs/search?query=Developer", headers=headers)
    assert response.status_code == 200
    payload = response.json()
    assert "data" in payload["data"]
    
    # 2. Get Dashboard Stats
    response = client.get("/api/v1/dashboard/stats", headers=headers)
    assert response.status_code == 200
    # Note: dashboard/stats is currently a simple GET in main.py, not /api/v1/dashboard/stats prefix yet
    # Wait, main.py has: app.get("/api/v1/dashboard/stats")
    payload = response.json()
    assert "atsScore" in payload["data"]
