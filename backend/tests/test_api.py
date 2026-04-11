"""
module: test_api.py
purpose: Integration tests for API endpoints using FastAPI TestClient.
         Tests that endpoints respond correctly, including Phase 9
         hardening features (validation, info endpoint, health check).
author: HP & Mushan
"""

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


class TestRootEndpoints:
    """Test basic API endpoints."""

    def test_root_returns_running(self):
        """GET / should confirm the API is running."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "running" in data["message"].lower()

    def test_health_check(self):
        """GET /health should return key configuration status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "anthropic_key_set" in data
        assert "tavily_key_set" in data
        assert "mongodb_url_set" in data

    def test_api_info(self):
        """GET /api/info should return full API summary."""
        response = client.get("/api/info")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "AutoAgent Studio API"
        assert "Planner" in data["agents"]
        assert "Researcher" in data["agents"]
        assert "Writer" in data["agents"]
        assert "single" in data["modes"]
        assert "multi" in data["modes"]
        assert "endpoints" in data


class TestInputValidation:
    """Test that Phase 9 Pydantic validation rejects bad inputs."""

    def test_empty_goal_returns_422(self):
        """POST /api/run with empty goal should return 422."""
        response = client.post("/api/run", json={"goal": "", "mode": "multi"})
        assert response.status_code == 422

    def test_short_goal_returns_422(self):
        """POST /api/run with very short goal should return 422."""
        response = client.post("/api/run", json={"goal": "Hi", "mode": "multi"})
        assert response.status_code == 422

    def test_invalid_mode_returns_422(self):
        """POST /api/run with invalid mode should return 422."""
        response = client.post(
            "/api/run",
            json={"goal": "Research AI trends", "mode": "turbo"}
        )
        assert response.status_code == 422

    def test_missing_goal_returns_422(self):
        """POST /api/run without goal field should return 422."""
        response = client.post("/api/run", json={"mode": "multi"})
        assert response.status_code == 422

    def test_planner_empty_goal_returns_422(self):
        """POST /api/planner with empty goal should return 422."""
        response = client.post("/api/planner", json={"goal": ""})
        assert response.status_code == 422

    def test_researcher_empty_subtask_returns_422(self):
        """POST /api/researcher with empty subtask should return 422."""
        response = client.post("/api/researcher", json={"subtask": ""})
        assert response.status_code == 422

    def test_writer_empty_goal_returns_422(self):
        """POST /api/writer with empty goal should return 422."""
        response = client.post("/api/writer", json={"goal": ""})
        assert response.status_code == 422


class TestNonexistentRoutes:
    """Test that undefined routes return 404."""

    def test_unknown_route_returns_404(self):
        """GET /api/nonexistent should return 404."""
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
