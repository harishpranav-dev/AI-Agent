"""
module: web_search.py
purpose: Web search tool using Tavily API. Used by Researcher Agent
         to find real-time information from the internet.
"""

import os
import logging
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# This JSON schema tells Claude what the tool does and what inputs it expects.
# Claude reads this definition and decides WHEN to call it based on the task.
TOOL_DEFINITION = {
    "name": "web_search",
    "description": (
        "Search the internet for current, real information on a topic. "
        "Use this when you need facts, statistics, recent news, or data "
        "that requires up-to-date sources. Returns relevant excerpts and URLs."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Specific search query. Be precise. E.g. 'AI diagnostic tools in hospitals 2025 statistics'"
            },
            "max_results": {
                "type": "integer",
                "description": "Number of results to return (1-5, default 3)",
                "default": 3
            }
        },
        "required": ["query"]
    }
}


async def execute_web_search(query: str, max_results: int = 3) -> dict:
    """
    Execute a web search using Tavily API.

    Args:
        query: Search query string
        max_results: Number of results to return (1-5)

    Returns:
        Dict with search results including titles, content snippets, and URLs
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        logger.error("TAVILY_API_KEY not set in environment")
        return {"error": "Search API key not configured", "results": []}

    try:
        logger.info(f"Web search: '{query}' (max {max_results} results)")
        client = TavilyClient(api_key=api_key)

        response = client.search(
            query=query,
            max_results=max_results,
            search_depth="advanced"
        )

        formatted_results = []
        for result in response.get("results", []):
            formatted_results.append({
                "title": result.get("title", ""),
                "content": result.get("content", "")[:500],
                "url": result.get("url", ""),
                "score": result.get("score", 0)
            })

        logger.info(f"Web search found {len(formatted_results)} results")
        return {
            "query": query,
            "results": formatted_results,
            "total_found": len(formatted_results)
        }

    except Exception as e:
        logger.error(f"Web search failed: {e}")
        return {"error": str(e), "query": query, "results": []}