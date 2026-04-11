"""Tests for BaseAgent class."""
import pytest
from agents.test_agent import TestAgent


@pytest.mark.asyncio
async def test_test_agent_returns_response():
    """Test that agent returns a non-empty response."""
    agent = TestAgent()
    result = await agent.run({"question": "What is 2+2?"})

    assert result["success"] == True
    assert len(result["answer"]) > 0
    assert result["agent"] == "Test Agent"