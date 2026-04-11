"""
module: test_validation.py
purpose: Tests for Phase 9 Pydantic input validation on API routes.
         Ensures bad inputs are rejected BEFORE reaching agents.
author: HP & Mushan
"""

import pytest
from pydantic import ValidationError
from routes.agent_routes import RunRequest, PlannerRequest, ResearcherRequest, WriterRequest


class TestRunRequestValidation:
    """Test input validation for POST /api/run."""

    def test_valid_request_passes(self):
        """Normal request should validate successfully."""
        req = RunRequest(goal="Research climate change solutions", mode="multi")
        assert req.goal == "Research climate change solutions"
        assert req.mode == "multi"

    def test_empty_goal_rejected(self):
        """Empty goal should raise validation error."""
        with pytest.raises(ValidationError, match="Goal cannot be empty"):
            RunRequest(goal="", mode="multi")

    def test_whitespace_only_goal_rejected(self):
        """Goal with only whitespace should be rejected."""
        with pytest.raises(ValidationError, match="Goal cannot be empty"):
            RunRequest(goal="   ", mode="multi")

    def test_short_goal_rejected(self):
        """Goal shorter than 5 characters should be rejected."""
        with pytest.raises(ValidationError, match="at least 5 characters"):
            RunRequest(goal="Hi", mode="multi")

    def test_long_goal_rejected(self):
        """Goal exceeding 500 characters should be rejected."""
        with pytest.raises(ValidationError, match="cannot exceed 500"):
            RunRequest(goal="x" * 501, mode="multi")

    def test_invalid_mode_rejected(self):
        """Mode other than 'single' or 'multi' should be rejected."""
        with pytest.raises(ValidationError, match="must be 'single' or 'multi'"):
            RunRequest(goal="Research something important", mode="turbo")

    def test_single_mode_accepted(self):
        """'single' mode should be valid."""
        req = RunRequest(goal="Research something important", mode="single")
        assert req.mode == "single"

    def test_goal_gets_stripped(self):
        """Leading/trailing whitespace should be removed from goal."""
        req = RunRequest(goal="  Research AI trends  ", mode="multi")
        assert req.goal == "Research AI trends"

    def test_default_mode_is_multi(self):
        """Mode should default to 'multi' if not specified."""
        req = RunRequest(goal="Research something important")
        assert req.mode == "multi"

    def test_default_client_id(self):
        """client_id should default to 'default'."""
        req = RunRequest(goal="Research something important")
        assert req.client_id == "default"


class TestPlannerRequestValidation:
    """Test input validation for POST /api/planner."""

    def test_valid_goal_passes(self):
        req = PlannerRequest(goal="Find AI trends")
        assert req.goal == "Find AI trends"

    def test_empty_goal_rejected(self):
        with pytest.raises(ValidationError):
            PlannerRequest(goal="")


class TestResearcherRequestValidation:
    """Test input validation for POST /api/researcher."""

    def test_valid_subtask_passes(self):
        req = ResearcherRequest(subtask="Find climate data", goal_context="Climate research")
        assert req.subtask == "Find climate data"

    def test_empty_subtask_rejected(self):
        with pytest.raises(ValidationError):
            ResearcherRequest(subtask="")

    def test_default_goal_context(self):
        """goal_context should default to empty string."""
        req = ResearcherRequest(subtask="Find data")
        assert req.goal_context == ""


class TestWriterRequestValidation:
    """Test input validation for POST /api/writer."""

    def test_valid_request_passes(self):
        req = WriterRequest(goal="Write about AI", findings=["finding 1"])
        assert req.goal == "Write about AI"
        assert len(req.findings) == 1

    def test_empty_goal_rejected(self):
        with pytest.raises(ValidationError):
            WriterRequest(goal="")

    def test_default_findings_empty_list(self):
        """findings should default to empty list."""
        req = WriterRequest(goal="Write about AI")
        assert req.findings == []
