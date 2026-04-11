"""
module: researcher_agent.py
purpose: Researcher Agent — takes a subtask from the Planner and uses
         web search to find real, current information. Returns structured findings.
author: HP & Mushan
"""

import json
import logging
from agents.base_agent import BaseAgent
from tools.tool_manager import ToolManager
from tools.web_search import TOOL_DEFINITION as WEB_SEARCH_TOOL

logger = logging.getLogger(__name__)

RESEARCHER_SYSTEM_PROMPT = """
You are a thorough research specialist with access to web search.

For the subtask given to you, find accurate, current, specific information.

RULES:
1. ALWAYS use the web_search tool at least once — never answer from memory alone
2. Search with specific, detailed queries (include years, statistics, specific topics)
3. Extract key facts and statistics from search results
4. Always note your sources (URLs)
5. Be objective — report what you find, not what you assume

Return ONLY this JSON format after completing your research:
{
  "subtask": "the subtask you researched",
  "key_findings": [
    "specific finding 1 with data",
    "specific finding 2 with data"
  ],
  "statistics": [
    "any numbers, percentages, or statistics found"
  ],
  "sources": [
    "URL or source name"
  ],
  "search_queries_used": [
    "the actual queries you searched"
  ],
  "confidence": "high"
}

Confidence levels: "high" (good sources found), "medium" (limited sources), "low" (couldn't find relevant info)
"""


class ResearcherAgent(BaseAgent):
    """
    Researcher Agent: Searches the web and gathers data for each subtask.
    Second agent in the multi-agent pipeline.

    Unlike the Planner (which only thinks), the Researcher can ACT —
    it calls the web_search tool to find real information from the internet.
    """

    def __init__(self):
        self.tool_manager = ToolManager()
        super().__init__(
            name="Researcher Agent",
            system_prompt=RESEARCHER_SYSTEM_PROMPT,
            tools=[WEB_SEARCH_TOOL]
        )

    async def execute_tool(self, tool_name: str, tool_input: dict) -> str:
        """
        Route tool calls through the ToolManager.
        This overrides the base class method so tools actually work.

        Args:
            tool_name: Name of the tool Claude wants to use
            tool_input: Parameters Claude provided for the tool

        Returns:
            Tool result as string fed back to Claude
        """
        return await self.tool_manager.execute(tool_name, tool_input)

    async def run(self, input_data: dict) -> dict:
        """
        Research a single subtask by searching the web.

        Args:
            input_data: {
                "subtask": "specific subtask to research",
                "goal_context": "original user goal for context"
            }

        Returns:
            {
              "success": True/False,
              "findings": { key_findings, statistics, sources, ... },
              "agent": "Researcher Agent",
              "subtask": "the subtask researched"
            }
        """
        subtask = input_data.get("subtask", "").strip()
        goal_context = input_data.get("goal_context", "")

        if not subtask:
            return {
                "success": False,
                "error": "Subtask cannot be empty",
                "agent": self.name
            }

        logger.info(f"Researcher: Working on subtask: '{subtask[:60]}...'")

        messages = [
            {
                "role": "user",
                "content": (
                    f"Research this subtask: {subtask}\n\n"
                    f"Context (overall goal): {goal_context}\n\n"
                    "Search for specific, current information and return "
                    "your findings as JSON."
                )
            }
        ]

        try:
            response_text = await self.call_claude(messages, max_tokens=2000)

            # Clean markdown code fences if Claude wraps JSON in them
            cleaned = response_text.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```")[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
            cleaned = cleaned.strip()

            findings = json.loads(cleaned)

            logger.info(
                f"Researcher: Found {len(findings.get('key_findings', []))} "
                f"findings for subtask"
            )

            return {
                "success": True,
                "findings": findings,
                "agent": self.name,
                "subtask": subtask
            }

        except json.JSONDecodeError as e:
            logger.error(f"Researcher: Failed to parse JSON: {e}")
            return {
                "success": False,
                "error": f"Failed to parse researcher output: {str(e)}",
                "raw_response": response_text,
                "agent": self.name
            }
        except Exception as e:
            logger.error(f"Researcher: Error: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }