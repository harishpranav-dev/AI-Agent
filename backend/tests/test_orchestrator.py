"""
module: test_orchestrator.py
purpose: Tests for the Orchestrator — the multi-agent pipeline coordinator.
         Matches the real Orchestrator.run(goal, mode, event_callback) API.
author: HP & Mushan
"""

import pytest
from agents.orchestrator import Orchestrator, parse_plan_json


# ============================================================
# Fast unit tests — no API calls
# ============================================================

def test_orchestrator_initializes_three_agents():
    """Orchestrator should hold all three agent instances."""
    orchestrator = Orchestrator()

    assert orchestrator.planner is not None
    assert orchestrator.researcher is not None
    assert orchestrator.writer is not None
    assert orchestrator.planner.name == "Planner"
    assert orchestrator.researcher.name == "Researcher"
    assert orchestrator.writer.name == "Writer"


def test_parse_plan_json_valid_input():
    """parse_plan_json should parse a clean JSON plan."""
    raw = '{"goal_summary": "test", "subtasks": ["a", "b", "c"], "complexity": "simple"}'
    plan = parse_plan_json(raw)

    assert plan["subtasks"] == ["a", "b", "c"]
    assert plan["complexity"] == "simple"


def test_parse_plan_json_strips_markdown_fence():
    """parse_plan_json should handle ```json code block wrappers."""
    raw = '```json\n{"subtasks": ["x", "y"]}\n```'
    plan = parse_plan_json(raw)

    assert plan["subtasks"] == ["x", "y"]


def test_parse_plan_json_rejects_missing_subtasks():
    """parse_plan_json should raise ValueError when subtasks key is missing."""
    raw = '{"goal_summary": "test"}'

    with pytest.raises(ValueError, match="subtasks"):
        parse_plan_json(raw)


def test_parse_plan_json_rejects_empty_subtasks():
    """parse_plan_json should raise ValueError when subtasks list is empty."""
    raw = '{"subtasks": []}'

    with pytest.raises(ValueError, match="zero subtasks"):
        parse_plan_json(raw)


def test_parse_plan_json_rejects_invalid_json():
    """parse_plan_json should raise ValueError for malformed JSON."""
    raw = "this is not json at all"

    with pytest.raises(ValueError):
        parse_plan_json(raw)


# ============================================================
# Live integration tests — marked slow, make real API calls.
# Each test runs the full agent pipeline and takes 30-90 seconds.
# Run the fast suite with: pytest -m "not slow"
# ============================================================

@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_multi_mode_returns_report():
    """Full multi-agent pipeline should return a task with a report."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        goal="Benefits of drinking water for health",
        mode="multi"
    )

    # Real orchestrator return shape: task_id, goal, mode, report, plan, metadata
    assert result["task_id"] is not None
    assert result["report"] is not None
    assert len(result["report"]) > 100
    assert result["mode"] == "multi"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_multi_mode_has_plan():
    """Multi mode result should include a valid plan with subtasks."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        goal="Benefits of drinking water for health",
        mode="multi"
    )

    assert result["plan"] is not None
    assert "subtasks" in result["plan"]
    assert len(result["plan"]["subtasks"]) >= 1


@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_multi_mode_metadata():
    """Multi mode should record all three agents in metadata."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        goal="Benefits of drinking water for health",
        mode="multi"
    )

    metadata = result["metadata"]
    assert "planner" in metadata["agents_used"]
    assert "researcher" in metadata["agents_used"]
    assert "writer" in metadata["agents_used"]
    assert metadata["tools_called"] >= 1
    assert metadata["steps_completed"] >= 3


@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_single_mode_skips_researcher():
    """Single mode should only use planner and writer — no researcher."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        goal="Explain how solar panels work",
        mode="single"
    )

    metadata = result["metadata"]
    assert "planner" in metadata["agents_used"]
    assert "writer" in metadata["agents_used"]
    assert "researcher" not in metadata["agents_used"]
    assert metadata["tools_called"] == 0


@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_emits_events():
    """Orchestrator should emit progress events via the callback passed to run()."""
    events_received = []

    async def capture_events(event_type: str, data: dict):
        events_received.append(event_type)

    orchestrator = Orchestrator()
    result = await orchestrator.run(
        goal="Benefits of exercise",
        mode="single",
        event_callback=capture_events
    )

    assert result["report"] is not None
    assert "task_started" in events_received
    assert "planner_complete" in events_received
    assert "task_complete" in events_received


@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_tracks_duration():
    """Metadata should include total_time_seconds showing task duration."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        goal="What is photosynthesis",
        mode="single"
    )

    assert "total_time_seconds" in result["metadata"]
    assert result["metadata"]["total_time_seconds"] >= 0


@pytest.mark.slow
@pytest.mark.asyncio
async def test_orchestrator_returns_unique_task_ids():
    """Every orchestrator run should return a unique task ID."""
    orchestrator = Orchestrator()
    result1 = await orchestrator.run(goal="Topic one", mode="single")
    result2 = await orchestrator.run(goal="Topic two", mode="single")

    assert result1["task_id"] != result2["task_id"]
