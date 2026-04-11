"""
module: planner_agent.py
purpose: Implements the Planner Agent that breaks user goals into
         3-5 clear, actionable subtasks for the Researcher.
author: HP & Mushan
"""

import logging
from agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)

PLANNER_SYSTEM_PROMPT = """You are a strategic planning expert for an autonomous AI research system.
Your ONLY job is to analyze the user's goal and break it into 3-5 clear, 
specific, searchable subtasks.

Rules:
- Each subtask must be independently researchable
- Subtasks must together fully cover the original goal
- Be specific — not "research X" but "find current statistics on X"
- Return ONLY valid JSON in this exact format:
{
  "goal_summary": "brief restatement of goal",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "complexity": "simple" | "moderate" | "complex"
}
- Never add commentary outside the JSON"""


class PlannerAgent(BaseAgent):
    """
    Strategic thinker agent. Takes a vague user goal and produces
    a structured plan with 3-5 specific, searchable subtasks.

    Like a project manager who receives "build a website" and
    creates a task list: design mockup, set up hosting, write content, etc.
    """

    def __init__(self):
        """Initialize with planner-specific system prompt and no tools."""
        super().__init__(
            name="Planner",
            system_prompt=PLANNER_SYSTEM_PROMPT,
            tools=[]  # Planner doesn't need tools — just reasoning
        )

    async def create_plan(self, goal: str, event_callback=None) -> str:
        """
        Break a user goal into subtasks.

        Args:
            goal: The user's raw goal string.
            event_callback: Optional async function to emit progress events.

        Returns:
            JSON string with goal_summary, subtasks, and complexity.
        """
        prompt = f"Break this goal into subtasks:\n\n{goal}"

        if event_callback:
            await event_callback("planner_thinking", {"goal": goal})

        result = await self.run(
            user_message=prompt,
            event_callback=event_callback
        )

        if event_callback:
            await event_callback("planner_complete", {"raw_output": result[:200]})

        logger.info(f"[Planner] Plan created for goal: {goal[:50]}...")
        return result
