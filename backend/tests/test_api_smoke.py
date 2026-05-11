from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_endpoint_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"


def test_resume_templates_route_is_not_shadowed():
    response = client.get("/api/v1/resumes/templates")
    assert response.status_code != 404
    payload = response.json()
    assert payload["success"] is True
    assert "templates" in payload["data"]
