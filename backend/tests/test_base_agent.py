"""
module: test_base_agent.py
purpose: Tests for the BaseAgent class.
         Uses PlannerAgent as a concrete subclass since TestAgent was removed.
author: HP & Mushan
"""

import pytest
from agents.base_agent import BaseAgent


# ============================================================
# Fast unit tests — no API calls
# ============================================================

def test_base_agent_initialization():
    """BaseAgent should initialize with the provided config."""
    agent = BaseAgent(
        name="TestBot",
        system_prompt="You are a test.",
        tools=[{"name": "dummy_tool", "description": "test"}]
    )

    assert agent.name == "TestBot"
    assert agent.system_prompt == "You are a test."
    assert len(agent.tools) == 1
    assert agent.model == "claude-sonnet-4-20250514"


def test_base_agent_default_tools_empty():
    """BaseAgent should default to an empty tools list."""
    agent = BaseAgent(name="NoTools", system_prompt="hi")

    assert agent.tools == []


def test_base_agent_custom_model():
    """BaseAgent should accept a custom model name."""
    agent = BaseAgent(
        name="Custom",
        system_prompt="hi",
        model="claude-3-5-sonnet-20241022"
    )

    assert agent.model == "claude-3-5-sonnet-20241022"


def test_base_agent_has_anthropic_client():
    """BaseAgent should create an AsyncAnthropic client on init."""
    agent = BaseAgent(name="Test", system_prompt="hi")

    # Client should exist and have the messages attribute
    assert agent.client is not None
    assert hasattr(agent.client, "messages")


# ============================================================
# Live API test — marked slow
# ============================================================

@pytest.mark.slow
@pytest.mark.asyncio
async def test_base_agent_run_returns_text():
    """BaseAgent.run should return a non-empty text response from Claude."""
    agent = BaseAgent(
        name="SimpleBot",
        system_prompt="Answer in exactly one sentence."
    )

    result = await agent.run(user_message="What is 2+2?")

    assert isinstance(result, str)
    assert len(result) > 0
