"""
package: tools
purpose: Exposes the tool handlers and registry used by agents to perform
         actions like web search and text processing. Import from this
         package instead of reaching into individual modules.
author: HP & Mushan
"""

from tools.web_search import web_search
from tools.text_tools import summarize_text, format_report
from tools.tool_manager import (
    TOOL_REGISTRY,
    TOOL_DEFINITIONS,
    execute_tool,
)

__all__ = [
    "web_search",
    "summarize_text",
    "format_report",
    "TOOL_REGISTRY",
    "TOOL_DEFINITIONS",
    "execute_tool",
]
