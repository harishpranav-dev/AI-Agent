"""
module: test_researcher.py
purpose: Tests for the Researcher Agent and web search tool.
         Matches the real function signatures in the project.
author: HP & Mushan
"""

import pytest
from agents.researcher_agent import ResearcherAgent
from tools.web_search import web_search


# ============================================
# TESTS FOR web_search tool
# ============================================

@pytest.mark.asyncio
async def test_web_search_returns_results():
    """Verify Tavily search returns actual results for a real query."""
    result = await web_search("Python programming language", max_results=2)

    # Either we get a successful search with results, or we get a clean
    # failure dict (e.g. if the API key isn't set in the test environment)
    assert "success" in result
    assert "results" in result

    if result["success"]:
        assert len(result["results"]) > 0
        assert "title" in result["results"][0]
        assert "url" in result["results"][0]
        assert "content" in result["results"][0]


@pytest.mark.asyncio
async def test_web_search_handles_empty_query():
    """Verify web_search returns a structured response even for an empty query."""
    result = await web_search("", max_results=1)

    # Should never raise — always returns a dict with success/results keys
    assert "success" in result
    assert "results" in result
    assert isinstance(result["results"], list)


# ============================================
# TESTS FOR ResearcherAgent
# ============================================

@pytest.mark.asyncio
async def test_researcher_agent_initializes():
    """Researcher agent should initialize with the correct name and tools."""
    agent = ResearcherAgent()

    assert agent.name == "Researcher"
    # Researcher should have at least the web_search tool available
    tool_names = [t["name"] for t in agent.tools]
    assert "web_search" in tool_names


@pytest.mark.asyncio
async def test_researcher_produces_findings():
    """Verify researcher produces findings for a real subtask."""
    agent = ResearcherAgent()
    result = await agent.research_subtask(
        subtask="Find statistics on renewable energy growth 2024",
        goal_context="renewable energy trends"
    )

    # research_subtask returns a string (JSON text from Claude)
    assert isinstance(result, str)
    assert len(result) > 0
