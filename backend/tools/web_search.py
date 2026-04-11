"""
module: web_search.py
purpose: Implements web search using the Tavily API.
         Used by the Researcher agent to find real-time information.
author: HP & Mushan
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

TAVILY_API_URL = "https://api.tavily.com/search"


async def web_search(query: str, max_results: int = 5) -> dict:
    """
    Search the internet using Tavily API.

    Tavily is a search API designed for AI agents — it returns
    clean, structured results instead of raw HTML like Google.

    Args:
        query: The search query string.
        max_results: Maximum number of results to return (default 5).

    Returns:
        Dict with 'results' list containing title, url, and content
        for each search result, or error info if search failed.
    """
    api_key = os.getenv("TAVILY_API_KEY", "")
    if not api_key:
        logger.error("TAVILY_API_KEY not set")
        return {
            "success": False,
            "error": "Search API key not configured",
            "results": []
        }

    payload = {
        "api_key": api_key,
        "query": query,
        "max_results": max_results,
        "search_depth": "basic"
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(TAVILY_API_URL, json=payload)
            response.raise_for_status()
            data = response.json()

        results = []
        for item in data.get("results", []):
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": item.get("content", "")[:500]  # Trim long content
            })

        logger.info(f"Web search for '{query}' returned {len(results)} results")
        return {
            "success": True,
            "query": query,
            "results": results
        }

    except httpx.TimeoutException:
        logger.error(f"Web search timed out for query: {query}")
        return {"success": False, "error": "Search timed out", "results": []}
    except Exception as e:
        logger.error(f"Web search failed: {e}")
        return {"success": False, "error": str(e), "results": []}