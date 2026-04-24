"""
module: researcher_agent.py
purpose: Implements the Researcher Agent that uses web search
         to find real data for each subtask from the Planner.
author: HP & Mushan
"""

import json
import logging
from agents.base_agent import BaseAgent
from tools.tool_manager import TOOL_DEFINITIONS, execute_tool

logger = logging.getLogger(__name__)


def _count_findings(result: str) -> int:
    """
    Count the number of key_findings in a researcher JSON result.

    The researcher returns JSON (sometimes wrapped in markdown code fences).
    This helper safely parses the JSON and returns the length of the
    key_findings array. Returns 0 if parsing fails rather than raising —
    the count is used for UI display only and should never break the pipeline.

    Args:
        result: Raw string output from the Researcher agent.

    Returns:
        Number of findings in the parsed JSON, or 0 if parsing fails.
    """
    cleaned = result.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        parsed = json.loads(cleaned)
        findings = parsed.get("key_findings", [])
        return len(findings) if isinstance(findings, list) else 0
    except (json.JSONDecodeError, AttributeError):
        return 0

RESEARCHER_SYSTEM_PROMPT = """You are a fast, focused research specialist with access to web search.
For each subtask given to you, find accurate, current information.

Rules:
- Use the web_search tool EXACTLY ONCE per subtask — one focused search query
- Extract the most important facts from the search results immediately
- Keep findings concise — 3-5 bullet points maximum
- Always note your sources
- Do NOT search multiple times — one search is enough
- Return structured JSON only:
{
  "subtask": "the subtask you researched",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "statistics": ["stat 1"],
  "sources": ["url or source name"],
  "confidence": "high" | "medium" | "low"
}"""


class ResearcherAgent(BaseAgent):
    """
    Information gatherer agent. For each subtask from the Planner,
    it searches the web and returns structured research findings.

    Like a research assistant who gets a topic, does one targeted search,
    and comes back with organized notes and source links.
    """

    def __init__(self):
        """Initialize with researcher system prompt and search tools."""
        # Only give the researcher web_search and summarize_text
        researcher_tools = [t for t in TOOL_DEFINITIONS if t["name"] in ("web_search", "summarize_text")]
        super().__init__(
            name="Researcher",
            system_prompt=RESEARCHER_SYSTEM_PROMPT,
            tools=researcher_tools
        )

    async def research_subtask(
        self,
        subtask: str,
        goal_context: str,
        event_callback=None
    ) -> str:
        """
        Research a single subtask using web search.

        Args:
            subtask: The specific subtask to research.
            goal_context: The original user goal for context.
            event_callback: Optional async function for progress events.

        Returns:
            JSON string with key_findings, statistics, sources, and confidence.
        """
        prompt = (
            f"Research the following subtask with ONE web search.\n\n"
            f"Overall goal: {goal_context}\n\n"
            f"Subtask to research: {subtask}\n\n"
            f"Use the web_search tool once with a focused query, then return your findings."
        )

        if event_callback:
            await event_callback("researcher_thinking", {"subtask": subtask})

        result = await self.run(
            user_message=prompt,
            tool_executor=execute_tool,
            event_callback=event_callback
        )

        if event_callback:
            await event_callback("researcher_complete", {
                "subtask": subtask,
                "result_preview": result[:200],
                "findings_count": _count_findings(result)
            })

        logger.info(f"[Researcher] Completed subtask: {subtask[:50]}...")
        return result