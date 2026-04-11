"""
module: test_researcher.py
purpose: Tests for the Researcher Agent and web search tool.
author: HP & Mushan
"""

import pytest
from agents.researcher_agent import ResearcherAgent
from tools.web_search import execute_web_search


@pytest.mark.asyncio
async def test_web_search_returns_results():
    """Verify Tavily search returns actual results."""
    result = await execute_web_search("Python programming language", max_results=2)
    assert "error" not in result or result.get("results") != []
    assert len(result["results"]) > 0
    assert "title" in result["results"][0]
    assert "url" in result["results"][0]


@pytest.mark.asyncio
async def test_researcher_returns_findings():
    """Verify researcher produces structured findings from a real subtask."""
    agent = ResearcherAgent()
    result = await agent.run({
        "subtask": "Find statistics on renewable energy growth 2024",
        "goal_context": "renewable energy trends"
    })
    assert result["success"] is True
    assert "findings" in result
    assert "key_findings" in result["findings"]
    assert len(result["findings"]["key_findings"]) > 0


@pytest.mark.asyncio
async def test_researcher_rejects_empty_subtask():
    """Verify researcher handles empty input gracefully."""
    agent = ResearcherAgent()
    result = await agent.run({"subtask": "", "goal_context": ""})
    assert result["success"] is False
    assert "error" in result