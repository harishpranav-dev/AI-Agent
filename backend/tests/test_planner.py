"""
module: test_planner.py
purpose: Tests for the Planner agent and plan JSON parsing.
author: HP & Mushan
"""

import pytest
from agents.orchestrator import parse_plan_json


class TestParsePlanJson:
    """Test the plan parsing utility used by the orchestrator."""

    def test_valid_json_parses_correctly(self):
        """Valid JSON plan should parse without errors."""
        raw = '{"goal_summary": "test", "subtasks": ["a", "b"], "complexity": "simple"}'
        result = parse_plan_json(raw)
        assert result["goal_summary"] == "test"
        assert len(result["subtasks"]) == 2

    def test_json_wrapped_in_code_block(self):
        """JSON wrapped in ```json ... ``` should still parse."""
        raw = '```json\n{"goal_summary": "test", "subtasks": ["a"], "complexity": "simple"}\n```'
        result = parse_plan_json(raw)
        assert result["subtasks"] == ["a"]

    def test_missing_subtasks_raises_error(self):
        """Plan without subtasks list should raise ValueError."""
        raw = '{"goal_summary": "test", "complexity": "simple"}'
        with pytest.raises(ValueError, match="missing 'subtasks'"):
            parse_plan_json(raw)

    def test_empty_subtasks_raises_error(self):
        """Plan with empty subtasks list should raise ValueError."""
        raw = '{"goal_summary": "test", "subtasks": [], "complexity": "simple"}'
        with pytest.raises(ValueError, match="zero subtasks"):
            parse_plan_json(raw)

    def test_invalid_json_raises_error(self):
        """Completely invalid JSON should raise ValueError."""
        raw = "This is not JSON at all"
        with pytest.raises(ValueError, match="invalid JSON"):
            parse_plan_json(raw)

    def test_json_with_extra_whitespace(self):
        """JSON with leading/trailing whitespace should parse fine."""
        raw = '  \n  {"goal_summary": "x", "subtasks": ["a", "b", "c"], "complexity": "moderate"}  \n  '
        result = parse_plan_json(raw)
        assert len(result["subtasks"]) == 3
