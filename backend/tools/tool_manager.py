"""
module: tool_manager.py
purpose: Central tool router. When an agent decides to use a tool,
         this manager routes the call to the right function.
"""

import logging
from tools.web_search import execute_web_search

logger = logging.getLogger(__name__)


class ToolManager:
    """Routes tool calls from agents to actual implementations."""

    async def execute(self, tool_name: str, tool_input: dict) -> str:
        """
        Execute a tool by name with given input.

        Args:
            tool_name: Name matching a registered tool (e.g. "web_search")
            tool_input: Input parameters for the tool

        Returns:
            Tool result as a formatted string (Claude needs string responses)
        """
        logger.info(f"ToolManager: Executing tool '{tool_name}'")

        try:
            if tool_name == "web_search":
                result = await execute_web_search(
                    query=tool_input.get("query", ""),
                    max_results=tool_input.get("max_results", 3)
                )
                return self._format_search_result(result)

            else:
                logger.warning(f"ToolManager: Unknown tool '{tool_name}'")
                return f"Tool '{tool_name}' is not registered"

        except Exception as e:
            logger.error(f"ToolManager: Tool '{tool_name}' failed: {e}")
            return f"Tool execution failed: {str(e)}"

    def _format_search_result(self, result: dict) -> str:
        """
        Format search results into a readable string for Claude.
        Claude receives this text and uses it to form its research findings.

        Args:
            result: Raw dict from execute_web_search

        Returns:
            Human-readable string of search results
        """
        if "error" in result and result.get("results") == []:
            return f"Search failed: {result['error']}"

        output = f"Search query: {result.get('query', '')}\n\n"

        for i, r in enumerate(result.get("results", []), 1):
            output += f"Result {i}:\n"
            output += f"Title: {r.get('title', 'No title')}\n"
            output += f"Content: {r.get('content', 'No content')}\n"
            output += f"Source: {r.get('url', 'No URL')}\n\n"

        return output