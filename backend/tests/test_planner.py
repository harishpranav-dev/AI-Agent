"""
Tests for PlannerAgent.
Tests validation logic and empty goal handling.
"""

import pytest
from agents.planner_agent import PlannerAgent


@pytest.mark.asyncio
async def test_planner_rejects_empty_goal():
    """Planner should reject empty goal without calling the API."""
    agent = PlannerAgent()
    result = await agent.run({"goal": ""})

    assert result["success"] is False
    assert "error" in result


@pytest.mark.asyncio
async def test_planner_rejects_whitespace_goal():
    """Planner should reject whitespace-only goal."""
    agent = PlannerAgent()
    result = await agent.run({"goal": "   "})

    assert result["success"] is False
    assert "error" in result


def test_planner_validate_plan_valid():
    """Validation should pass for a correctly structured plan."""
    agent = PlannerAgent()
    valid_plan = {
        "goal_summary": "Test goal",
        "subtasks": ["task 1", "task 2", "task 3"],
        "complexity": "moderate"
    }
    assert agent._validate_plan(valid_plan) is True


def test_planner_validate_plan_missing_key():
    """Validation should fail when a required key is missing."""
    agent = PlannerAgent()
    bad_plan = {"goal_summary": "Test", "subtasks": ["a"]}
    with pytest.raises(ValueError, match="missing required key"):
        agent._validate_plan(bad_plan)


def test_planner_validate_plan_too_many_subtasks():
    """Validation should fail when more than 5 subtasks are provided."""
    agent = PlannerAgent()
    bad_plan = {
        "goal_summary": "Test",
        "subtasks": ["a", "b", "c", "d", "e", "f"],
        "complexity": "complex"
    }
    with pytest.raises(ValueError, match="too many subtasks"):
        agent._validate_plan(bad_plan)


def test_planner_validate_plan_invalid_complexity():
    """Validation should fail for invalid complexity value."""
    agent = PlannerAgent()
    bad_plan = {
        "goal_summary": "Test",
        "subtasks": ["a"],
        "complexity": "extreme"
    }
    with pytest.raises(ValueError, match="complexity must be one of"):
        agent._validate_plan(bad_plan)