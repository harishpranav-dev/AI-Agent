"""
module: test_writer.py
purpose: Tests for the Writer Agent.
         Tests report generation, input validation, and edge cases.
author: HP & Mushan
"""

import pytest
from agents.writer_agent import WriterAgent


# ============================================================
# Test Data — realistic sample findings from the Researcher Agent
# ============================================================

SAMPLE_FINDINGS = [
    {
        "success": True,
        "findings": {
            "subtask": "AI in healthcare statistics",
            "key_findings": [
                "AI diagnostics now 94% accurate in some studies",
                "30% of hospitals using AI tools"
            ],
            "statistics": [
                "$45B AI healthcare market by 2026"
            ],
            "sources": [
                "https://example.com/ai-health"
            ]
        }
    },
    {
        "success": True,
        "findings": {
            "subtask": "AI drug discovery progress",
            "key_findings": [
                "AI-discovered drugs entering clinical trials",
                "Drug development time reduced by 40% with AI"
            ],
            "statistics": [
                "Over 150 AI drug discovery startups worldwide"
            ],
            "sources": [
                "https://example.com/ai-drugs"
            ]
        }
    }
]

SINGLE_FINDING = [
    {
        "success": True,
        "findings": {
            "subtask": "Renewable energy trends",
            "key_findings": [
                "Solar energy costs dropped 89% since 2010"
            ],
            "statistics": [],
            "sources": [
                "https://example.com/solar"
            ]
        }
    }
]

ALL_FAILED_FINDINGS = [
    {
        "success": False,
        "error": "Search API timeout"
    },
    {
        "success": False,
        "error": "No results found"
    }
]


# ============================================================
# Tests
# ============================================================

@pytest.mark.asyncio
async def test_writer_produces_report():
    """Writer should produce a markdown report from valid findings."""
    agent = WriterAgent()
    result = await agent.run({
        "goal": "AI impact on healthcare",
        "all_findings": SAMPLE_FINDINGS
    })

    assert result["success"] is True
    assert len(result["report"]) > 100, "Report should be substantial"
    assert result["word_count"] > 50, "Report should have meaningful word count"
    assert result["agent"] == "Writer Agent"


@pytest.mark.asyncio
async def test_writer_report_contains_markdown():
    """Writer should produce properly structured markdown."""
    agent = WriterAgent()
    result = await agent.run({
        "goal": "AI impact on healthcare",
        "all_findings": SAMPLE_FINDINGS
    })

    assert result["success"] is True
    report = result["report"]
    # Report should contain markdown headers
    assert "#" in report, "Report should contain markdown headers"


@pytest.mark.asyncio
async def test_writer_handles_single_finding():
    """Writer should work even with just one research finding."""
    agent = WriterAgent()
    result = await agent.run({
        "goal": "Renewable energy trends",
        "all_findings": SINGLE_FINDING
    })

    assert result["success"] is True
    assert result["word_count"] > 30


@pytest.mark.asyncio
async def test_writer_rejects_empty_goal():
    """Writer should fail if no goal is provided."""
    agent = WriterAgent()
    result = await agent.run({
        "goal": "",
        "all_findings": SAMPLE_FINDINGS
    })

    assert result["success"] is False
    assert "Goal is required" in result["error"]


@pytest.mark.asyncio
async def test_writer_rejects_no_findings():
    """Writer should fail if no findings are provided."""
    agent = WriterAgent()
    result = await agent.run({
        "goal": "test goal",
        "all_findings": []
    })

    assert result["success"] is False
    assert "No research findings" in result["error"]


@pytest.mark.asyncio
async def test_writer_rejects_all_failed_findings():
    """Writer should fail gracefully if ALL research findings failed."""
    agent = WriterAgent()
    result = await agent.run({
        "goal": "test goal",
        "all_findings": ALL_FAILED_FINDINGS
    })

    assert result["success"] is False
    assert "failed" in result["error"].lower()


@pytest.mark.asyncio
async def test_writer_skips_failed_findings_uses_good_ones():
    """Writer should skip failed findings but still produce a report from successful ones."""
    mixed_findings = [
        {
            "success": False,
            "error": "API timeout"
        },
        {
            "success": True,
            "findings": {
                "subtask": "Climate change effects",
                "key_findings": ["Global temperature rose 1.1°C since pre-industrial times"],
                "statistics": ["Sea levels rising 3.6mm per year"],
                "sources": ["https://example.com/climate"]
            }
        }
    ]

    agent = WriterAgent()
    result = await agent.run({
        "goal": "Climate change impact",
        "all_findings": mixed_findings
    })

    assert result["success"] is True
    assert result["word_count"] > 30


@pytest.mark.asyncio
async def test_build_research_summary():
    """Test the internal research summary builder directly."""
    agent = WriterAgent()
    summary = agent._build_research_summary(SAMPLE_FINDINGS)

    assert "AI in healthcare statistics" in summary
    assert "AI drug discovery progress" in summary
    assert "94% accurate" in summary
    assert "$45B" in summary
    assert "https://example.com/ai-health" in summary


@pytest.mark.asyncio
async def test_build_research_summary_skips_failures():
    """Summary builder should skip failed findings."""
    agent = WriterAgent()
    summary = agent._build_research_summary(ALL_FAILED_FINDINGS)

    # Should be empty since all findings failed
    assert summary.strip() == ""