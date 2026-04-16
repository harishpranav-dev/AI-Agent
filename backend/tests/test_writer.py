"""
module: test_writer.py
purpose: Tests for the Writer Agent.
         Matches the real WriterAgent.write_report(goal, all_findings) API.
author: HP & Mushan
"""

import pytest
from agents.writer_agent import WriterAgent


# ============================================================
# Test Data — sample findings the orchestrator would feed in.
# The real Researcher returns JSON strings, so we use strings here.
# ============================================================

SAMPLE_FINDINGS = [
    '{"subtask": "AI in healthcare statistics", '
    '"key_findings": ["AI diagnostics 94% accurate in some studies", '
    '"30% of hospitals using AI tools"], '
    '"statistics": ["$45B AI healthcare market by 2026"], '
    '"sources": ["https://example.com/ai-health"], '
    '"confidence": "high"}',

    '{"subtask": "AI drug discovery progress", '
    '"key_findings": ["AI-discovered drugs entering clinical trials", '
    '"Drug development time reduced by 40% with AI"], '
    '"statistics": ["Over 150 AI drug discovery startups worldwide"], '
    '"sources": ["https://example.com/ai-drugs"], '
    '"confidence": "high"}'
]

SINGLE_FINDING = [
    '{"subtask": "Renewable energy trends", '
    '"key_findings": ["Solar energy costs dropped 89% since 2010"], '
    '"statistics": [], '
    '"sources": ["https://example.com/solar"], '
    '"confidence": "medium"}'
]


# ============================================================
# Initialization tests (fast — no API calls)
# ============================================================

def test_writer_initializes_with_correct_name():
    """Writer agent should initialize with the name 'Writer'."""
    agent = WriterAgent()
    assert agent.name == "Writer"


def test_writer_has_no_tools():
    """Writer agent has no tools — it only writes text."""
    agent = WriterAgent()
    assert agent.tools == []


def test_writer_has_system_prompt():
    """Writer should have a non-empty system prompt."""
    agent = WriterAgent()
    assert agent.system_prompt is not None
    assert len(agent.system_prompt) > 0
    assert "writer" in agent.system_prompt.lower()


# ============================================================
# Live API tests — marked slow so they can be skipped.
# These make real Claude API calls, so they take ~20-40s each.
# Run the fast suite with: pytest -m "not slow"
# ============================================================

@pytest.mark.slow
@pytest.mark.asyncio
async def test_writer_produces_report():
    """Writer should produce a markdown report from valid findings."""
    agent = WriterAgent()
    report = await agent.write_report(
        goal="AI impact on healthcare",
        all_findings=SAMPLE_FINDINGS
    )

    # write_report returns a string directly
    assert isinstance(report, str)
    assert len(report) > 100, "Report should be substantial"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_writer_report_contains_markdown():
    """Writer should produce properly structured markdown with headers."""
    agent = WriterAgent()
    report = await agent.write_report(
        goal="AI impact on healthcare",
        all_findings=SAMPLE_FINDINGS
    )

    assert "#" in report, "Report should contain markdown headers"


@pytest.mark.slow
@pytest.mark.asyncio
async def test_writer_handles_single_finding():
    """Writer should work even with just one research finding."""
    agent = WriterAgent()
    report = await agent.write_report(
        goal="Renewable energy trends",
        all_findings=SINGLE_FINDING
    )

    assert isinstance(report, str)
    # With only one finding the report may be shorter, but should still exist
    assert len(report.split()) > 30
