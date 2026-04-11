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
from agents.researcher_agent import ResearcherAgent

router = APIRouter(prefix="/api", tags=["agents"])


class GoalRequest(BaseModel):
    """Request body for any agent that takes a goal string."""
    goal: str


class ResearchRequest(BaseModel):
    """Request body for the Researcher Agent."""
    subtask: str
    goal_context: str = ""


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


@router.post("/researcher")
async def run_researcher(request: ResearchRequest):
    """
    Run the Researcher Agent on a specific subtask.
    Uses web search to find real information from the internet.
    """
    try:
        researcher = ResearcherAgent()
        result = await researcher.run({
            "subtask": request.subtask,
            "goal_context": request.goal_context
        })
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}