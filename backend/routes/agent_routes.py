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
from agents.writer_agent import WriterAgent
from agents.orchestrator import Orchestrator
from streaming.websocket_manager import ws_manager

router = APIRouter(prefix="/api", tags=["agents"])


class GoalRequest(BaseModel):
    """Request body for any agent that takes a goal string."""
    goal: str


class ResearchRequest(BaseModel):
    """Request body for the Researcher Agent."""
    subtask: str
    goal_context: str = ""


class WriterRequest(BaseModel):
    """Request body for the Writer Agent."""
    goal: str
    all_findings: list


class RunRequest(BaseModel):
    """
    Request body for the full multi-agent pipeline.
    
    client_id connects this HTTP request to the right WebSocket.
    The frontend sends the same client_id when it opens the WebSocket
    AND when it calls /api/run — this is how we know which browser
    tab should receive the live progress events.
    """
    goal: str
    mode: str = "multi"
    client_id: str = "default"


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


@router.post("/writer")
async def run_writer(request: WriterRequest):
    """Run the Writer Agent to produce final report."""
    try:
        writer = WriterAgent()
        result = await writer.run({
            "goal": request.goal,
            "all_findings": request.all_findings
        })
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/run")
async def run_agents(request: RunRequest):
    """
    Run the full multi-agent pipeline with real-time WebSocket updates.

    This is the main endpoint — it triggers:
    Planner → Researcher (per subtask) → Writer

    The client_id links this request to a WebSocket connection.
    As agents work, progress events are pushed to the client
    in real time through the WebSocket.

    Args (JSON body):
        goal: The user's research goal
        mode: "multi" (full pipeline) or "single" (skip researcher)
        client_id: Unique ID matching the client's WebSocket connection

    Returns:
        Complete task result with plan, report, and stats
    """
    try:
        # Create a callback that sends events to THIS specific client.
        # This closure "captures" request.client_id so the Orchestrator
        # doesn't need to know anything about WebSockets — it just
        # calls emit() and events magically reach the right browser tab.
        async def emit_to_client(event_type: str, data: dict) -> None:
            """Send an event to the connected WebSocket client."""
            await ws_manager.send_event(request.client_id, event_type, data)

        orchestrator = Orchestrator(event_callback=emit_to_client)
        result = await orchestrator.run(
            goal=request.goal,
            mode=request.mode
        )
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}