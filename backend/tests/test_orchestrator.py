"""
module: test_orchestrator.py
purpose: Tests for the Orchestrator — the multi-agent pipeline coordinator.
         Tests cover: full pipeline, single mode, event emission, error handling.
author: HP & Mushan
"""

import pytest
from agents.orchestrator import Orchestrator


@pytest.mark.asyncio
async def test_orchestrator_multi_mode_succeeds():
    """Full multi-agent pipeline should return a successful report."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        "Benefits of drinking water for health",
        mode="multi"
    )

    assert result["success"] is True
    assert result["report"] is not None
    assert len(result["report"]) > 100
    assert result["task_id"] is not None


@pytest.mark.asyncio
async def test_orchestrator_multi_mode_has_plan():
    """Multi mode result should include a valid plan with subtasks."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        "Benefits of drinking water for health",
        mode="multi"
    )

    assert result["plan"] is not None
    assert "subtasks" in result["plan"]
    assert len(result["plan"]["subtasks"]) >= 1


@pytest.mark.asyncio
async def test_orchestrator_multi_mode_stats():
    """Multi mode should show all three agents used and tools called."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        "Benefits of drinking water for health",
        mode="multi"
    )

    stats = result["stats"]
    assert "planner" in stats["agents_used"]
    assert "researcher" in stats["agents_used"]
    assert "writer" in stats["agents_used"]
    assert stats["tools_called"] >= 1
    assert stats["steps_completed"] >= 3


@pytest.mark.asyncio
async def test_orchestrator_single_mode_succeeds():
    """Single mode should produce a report without using the researcher."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        "Explain how solar panels work",
        mode="single"
    )

    assert result["success"] is True
    assert result["report"] is not None
    assert len(result["report"]) > 50


@pytest.mark.asyncio
async def test_orchestrator_single_mode_skips_researcher():
    """Single mode should only use planner and writer — no researcher."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        "Explain how solar panels work",
        mode="single"
    )

    stats = result["stats"]
    assert "planner" in stats["agents_used"]
    assert "writer" in stats["agents_used"]
    assert "researcher" not in stats["agents_used"]
    assert stats["tools_called"] == 0


@pytest.mark.asyncio
async def test_orchestrator_emits_events():
    """Orchestrator should emit progress events via the callback."""
    events_received = []

    async def capture_events(event_type: str, data: dict):
        """Capture all events emitted by the orchestrator."""
        events_received.append(event_type)

    orchestrator = Orchestrator(event_callback=capture_events)
    result = await orchestrator.run(
        "Benefits of exercise",
        mode="single"
    )

    assert result["success"] is True
    assert "task_started" in events_received
    assert "planner_thinking" in events_received
    assert "planner_complete" in events_received
    assert "writer_thinking" in events_received
    assert "task_complete" in events_received


@pytest.mark.asyncio
async def test_orchestrator_returns_task_id():
    """Every orchestrator run should return a unique task ID."""
    orchestrator = Orchestrator()
    result1 = await orchestrator.run("Topic one", mode="single")
    result2 = await orchestrator.run("Topic two", mode="single")

    assert result1["task_id"] is not None
    assert result2["task_id"] is not None
    assert result1["task_id"] != result2["task_id"]


@pytest.mark.asyncio
async def test_orchestrator_tracks_duration():
    """Stats should include total_seconds showing how long the task took."""
    orchestrator = Orchestrator()
    result = await orchestrator.run(
        "What is photosynthesis",
        mode="single"
    )

    assert "total_seconds" in result["stats"]
    assert result["stats"]["total_seconds"] >= 0