"""
module: test_tools.py
purpose: Tests for text processing tools and the tool manager.
author: HP & Mushan
"""

import pytest
import pytest_asyncio
from tools.text_tools import summarize_text, format_report
from tools.tool_manager import execute_tool


@pytest.mark.asyncio
class TestSummarizeText:
    """Test the summarize_text tool."""

    async def test_short_text_unchanged(self):
        """Text shorter than max_length should be returned as-is."""
        result = await summarize_text("Hello world", max_length=300)
        assert result["success"] is True
        assert result["summary"] == "Hello world"

    async def test_long_text_truncated(self):
        """Long text should be truncated to max_length."""
        long_text = "This is a sentence. " * 50
        result = await summarize_text(long_text, max_length=100)
        assert result["success"] is True
        assert len(result["summary"]) <= 110  # Allow slight overshoot for sentence boundary

    async def test_empty_text_fails(self):
        """Empty text should return success=False."""
        result = await summarize_text("")
        assert result["success"] is False


@pytest.mark.asyncio
class TestFormatReport:
    """Test the format_report tool."""

    async def test_formats_sections_to_markdown(self):
        """Sections should be formatted with markdown headers."""
        sections = [
            {"title": "Introduction", "content": "Hello"},
            {"title": "Body", "content": "Main stuff"}
        ]
        result = await format_report(sections)
        assert result["success"] is True
        assert "## Introduction" in result["formatted"]
        assert "## Body" in result["formatted"]

    async def test_empty_sections_fails(self):
        """Empty sections list should return success=False."""
        result = await format_report([])
        assert result["success"] is False


@pytest.mark.asyncio
class TestToolManager:
    """Test the tool manager routing."""

    async def test_unknown_tool_returns_error(self):
        """Calling a non-existent tool should return an error string."""
        result = await execute_tool("nonexistent_tool", {})
        assert "Error" in result
        assert "Unknown tool" in result

    async def test_invalid_args_returns_error(self):
        """Calling a tool with wrong arguments should return an error."""
        result = await execute_tool("summarize_text", {"wrong_arg": "value"})
        assert "Error" in result
