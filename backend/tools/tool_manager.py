"""
module: tool_manager.py
purpose: Routes tool calls from Claude API responses to the correct
         handler function. Acts as a registry of all available tools.
author: HP & Mushan
"""

import logging
from tools.web_search import web_search
from tools.text_tools import summarize_text, format_report

logger = logging.getLogger(__name__)

# Registry: maps tool names (as Claude knows them) to handler functions.
# NOTE: `format_report` is registered but not currently exposed to Claude
# via TOOL_DEFINITIONS below, so no agent can invoke it right now. It is
# kept here intentionally as a ready-to-wire option for a future phase.
TOOL_REGISTRY = {
    "web_search": web_search,
    "summarize_text": summarize_text,
    "format_report": format_report,
}

# Tool definitions sent to Claude API so it knows what tools are available
TOOL_DEFINITIONS = [
    {
        "name": "web_search",
        "description": "Search the internet for current information on any topic. Returns titles, URLs, and content snippets.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to look up"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "summarize_text",
        "description": "Summarize a long piece of text into a shorter version.",
        "input_schema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "The text to summarize"
                },
                "max_length": {
                    "type": "integer",
                    "description": "Maximum length of summary in characters",
                    "default": 300
                }
            },
            "required": ["text"]
        }
    }
]


async def execute_tool(tool_name: str, tool_input: dict) -> str:
    """
    Execute a tool by name with the given input.

    This is called when Claude's response includes a tool_use block.
    We look up the tool in our registry and run it.

    Args:
        tool_name: Name of the tool Claude wants to call.
        tool_input: Dict of arguments Claude provided for the tool.

    Returns:
        String result to send back to Claude as tool_result.
    """
    if tool_name not in TOOL_REGISTRY:
        error_msg = f"Unknown tool: {tool_name}"
        logger.error(error_msg)
        return f"Error: {error_msg}"

    try:
        handler = TOOL_REGISTRY[tool_name]
        result = await handler(**tool_input)
        logger.info(f"Tool '{tool_name}' executed successfully")
        return str(result)
    except TypeError as e:
        error_msg = f"Invalid arguments for tool '{tool_name}': {e}"
        logger.error(error_msg)
        return f"Error: {error_msg}"
    except Exception as e:
        error_msg = f"Tool '{tool_name}' failed: {e}"
        logger.error(error_msg)
        return f"Error: {error_msg}"