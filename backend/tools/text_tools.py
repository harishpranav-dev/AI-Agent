"""
module: text_tools.py
purpose: Text processing tools for agents — summarization and formatting.
author: HP & Mushan
"""

import logging

logger = logging.getLogger(__name__)


async def summarize_text(text: str, max_length: int = 300) -> dict:
    """
    Summarize long text by truncating to key content.
    
    In v1 this is a simple truncation. In v2 this could use
    Claude to generate a proper summary.

    Args:
        text: The text to summarize.
        max_length: Maximum character length for the summary.

    Returns:
        Dict with the summarized text.
    """
    if not text:
        return {"success": False, "error": "No text provided", "summary": ""}

    if len(text) <= max_length:
        summary = text
    else:
        # Cut at last complete sentence within max_length
        truncated = text[:max_length]
        last_period = truncated.rfind(".")
        if last_period > max_length // 2:
            summary = truncated[:last_period + 1]
        else:
            summary = truncated + "..."

    logger.info(f"Summarized text from {len(text)} to {len(summary)} chars")
    return {"success": True, "summary": summary}


async def format_report(sections: list[dict]) -> dict:
    """
    Format research sections into a clean markdown structure.

    Args:
        sections: List of dicts with 'title' and 'content' keys.

    Returns:
        Dict with formatted markdown string.
    """
    if not sections:
        return {"success": False, "error": "No sections provided", "formatted": ""}

    markdown_parts = []
    for section in sections:
        title = section.get("title", "Untitled Section")
        content = section.get("content", "")
        markdown_parts.append(f"## {title}\n\n{content}\n")

    formatted = "\n".join(markdown_parts)
    logger.info(f"Formatted report with {len(sections)} sections")
    return {"success": True, "formatted": formatted}