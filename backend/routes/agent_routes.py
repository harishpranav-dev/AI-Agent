"""
module: agent_routes.py
purpose: API routes for all agent operations.
         Each endpoint creates an agent instance and runs it.
author: HP & Mushan
"""

from fastapi import APIRouter
from pydantic import BaseModel
from agents.test_agent import TestAgent
from agents.planner_agent import PlannerAgent

router = APIRouter(prefix="/api", tags=["agents"])


class GoalRequest(BaseModel):
    """Request body for any agent that takes a goal string."""
    goal: str


@router.post("/test-agent")
async def test_agent(payload: dict):
    """Test endpoint — verifies Claude API connection."""
    try:
        agent = TestAgent()
        result = await agent.run(payload)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/planner")
async def run_planner(request: GoalRequest):
    """
    Run the Planner Agent.
    Takes a goal, returns a structured research plan with subtasks.
    """
    try:
        planner = PlannerAgent()
        result = await planner.run({"goal": request.goal})
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}