"""
module: planner_agent.py
purpose: Implements the Planner Agent that breaks user goals into subtasks.
         This is the first agent in the multi-agent pipeline. It receives a
         raw goal string and returns a structured JSON plan with 3-5 specific,
         searchable subtasks that the Researcher Agent will execute.
author: HP & Mushan
"""

import json
import logging
from agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)

PLANNER_SYSTEM_PROMPT = """
You are a strategic task planning expert for an autonomous AI research system.

Your ONLY job is to analyze the user's goal and break it into 3-5 specific, 
searchable subtasks that a research agent can execute independently.

STRICT RULES:
1. Each subtask must be specific and independently researchable
2. Together, subtasks must fully cover the original goal
3. Be concrete — not "research AI" but "find current statistics on AI adoption in healthcare 2024-2025"
4. Return ONLY valid JSON — no text before or after
5. Use this exact format:

{
  "goal_summary": "brief 1-sentence restatement of the goal",
  "subtasks": [
    "specific subtask 1",
    "specific subtask 2",
    "specific subtask 3"
  ],
  "complexity": "simple"
}

Complexity values: "simple" (1-2 subtasks), "moderate" (3 subtasks), "complex" (4-5 subtasks)
"""


class PlannerAgent(BaseAgent):
    """
    Planner Agent: Decomposes a user goal into structured subtasks.
    First agent in the multi-agent pipeline.
    """

    def __init__(self):
        super().__init__(
            name="Planner Agent",
            system_prompt=PLANNER_SYSTEM_PROMPT
        )

    def _validate_plan(self, plan: dict) -> bool:
        """
        Validates that the planner output has the required structure.

        Args:
            plan: Parsed JSON dict from planner

        Returns:
            True if valid, raises ValueError if not
        """
        required_keys = ["goal_summary", "subtasks", "complexity"]
        for key in required_keys:
            if key not in plan:
                raise ValueError(f"Planner output missing required key: '{key}'")

        if not isinstance(plan["subtasks"], list):
            raise ValueError("Planner 'subtasks' must be a list")

        if len(plan["subtasks"]) < 1:
            raise ValueError("Planner must return at least 1 subtask")

        if len(plan["subtasks"]) > 5:
            raise ValueError("Planner returned too many subtasks (max 5)")

        valid_complexities = ["simple", "moderate", "complex"]
        if plan["complexity"] not in valid_complexities:
            raise ValueError(
                f"Planner complexity must be one of {valid_complexities}, "
                f"got '{plan['complexity']}'"
            )

        return True

    async def run(self, input_data: dict) -> dict:
        """
        Run the planner agent.

        Args:
            input_data: { "goal": "user's goal string" }

        Returns:
            {
              "success": bool,
              "plan": { "goal_summary": str, "subtasks": [...], "complexity": str },
              "agent": str,
              "original_goal": str
            }
        """
        goal = input_data.get("goal", "").strip()

        if not goal:
            return {"success": False, "error": "Goal cannot be empty", "agent": self.name}

        logger.info(f"Planner: Processing goal: '{goal[:80]}...'")

        messages = [
            {
                "role": "user",
                "content": f"Create a research plan for this goal: {goal}"
            }
        ]

        try:
            response_text = await self.call_claude(messages, max_tokens=1000)

            # Clean response — strip markdown code fences if Claude wraps them
            cleaned = response_text.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```")[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
            cleaned = cleaned.strip()

            plan = json.loads(cleaned)
            self._validate_plan(plan)

            logger.info(f"Planner: Generated {len(plan['subtasks'])} subtasks")

            return {
                "success": True,
                "plan": plan,
                "agent": self.name,
                "original_goal": goal
            }

        except json.JSONDecodeError as e:
            logger.error(f"Planner: Failed to parse JSON response: {e}")
            return {
                "success": False,
                "error": f"Planner returned invalid JSON: {str(e)}",
                "raw_response": response_text,
                "agent": self.name
            }
        except ValueError as e:
            logger.error(f"Planner: Validation failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }