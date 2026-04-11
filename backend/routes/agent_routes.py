"""
module: agent_routes.py
purpose: API routes for running agents — POST /api/run, POST /api/planner, etc.

         PHASE 9 UPDATE: All inputs validated with Pydantic models.
         Invalid requests get rejected with clear error messages
         BEFORE they reach any agent code.
         
author: HP & Mushan
"""

import logging
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, field_validator

from agents.orchestrator import Orchestrator
from agents.planner_agent import PlannerAgent
from agents.researcher_agent import ResearcherAgent
from agents.writer_agent import WriterAgent
from streaming.websocket_manager import ws_manager

logger = logging.getLogger(__name__)
router = APIRouter()


# ── PYDANTIC REQUEST MODELS (Phase 9) ─────────────────────────
# These validate every incoming request automatically.
# If validation fails, FastAPI returns a 422 error with details.


class RunRequest(BaseModel):
    """
    Request body for POST /api/run.
    
    Pydantic validators run BEFORE your route handler code.
    If 'goal' is empty or 'mode' is invalid, the request never
    reaches the orchestrator — it gets rejected immediately.
    """
    goal: str
    mode: str = "multi"
    client_id: str = "default"

    @field_validator("goal")
    @classmethod
    def goal_must_be_valid(cls, value: str) -> str:
        """Ensure goal is not empty and within length limits."""
        stripped = value.strip()
        if not stripped:
            raise ValueError("Goal cannot be empty")
        if len(stripped) < 5:
            raise ValueError("Goal must be at least 5 characters")
        if len(stripped) > 500:
            raise ValueError("Goal cannot exceed 500 characters")
        return stripped

    @field_validator("mode")
    @classmethod
    def mode_must_be_valid(cls, value: str) -> str:
        """Ensure mode is either 'single' or 'multi'."""
        if value not in ("single", "multi"):
            raise ValueError("Mode must be 'single' or 'multi'")
        return value


class PlannerRequest(BaseModel):
    """Request body for POST /api/planner."""
    goal: str

    @field_validator("goal")
    @classmethod
    def goal_not_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Goal cannot be empty")
        return stripped


class ResearcherRequest(BaseModel):
    """Request body for POST /api/researcher."""
    subtask: str
    goal_context: str = ""

    @field_validator("subtask")
    @classmethod
    def subtask_not_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Subtask cannot be empty")
        return stripped


class WriterRequest(BaseModel):
    """Request body for POST /api/writer."""
    goal: str
    findings: list[str] = []

    @field_validator("goal")
    @classmethod
    def goal_not_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Goal cannot be empty")
        return stripped


# ── ROUTE HANDLERS ─────────────────────────────────────────────


@router.post("/api/run")
async def run_agents(request: RunRequest, background_tasks: BackgroundTasks):
    """
    Main endpoint — runs the full agent pipeline.

    In 'multi' mode: Planner → Researcher → Writer (with web search).
    In 'single' mode: Planner → Writer (no web search, LLM knowledge only).

    The pipeline runs as a background task so this endpoint responds
    immediately. Real-time progress is pushed via WebSocket.
    """
    logger.info(f"POST /api/run — goal='{request.goal[:50]}...' mode={request.mode}")

    orchestrator = Orchestrator()

    # Create a callback that routes orchestrator events to the right WebSocket client
    async def ws_callback(event_type: str, data: dict):
        """Send orchestrator events to the browser via WebSocket."""
        await ws_manager.send_event(request.client_id, event_type, data)

    # Run the pipeline in the background so the HTTP response returns immediately
    background_tasks.add_task(
        orchestrator.run,
        goal=request.goal,
        mode=request.mode,
        session_id=request.client_id,
        event_callback=ws_callback
    )

    return {
        "success": True,
        "message": f"Agent pipeline started in {request.mode} mode",
        "mode": request.mode,
        "goal": request.goal
    }


@router.post("/api/planner")
async def run_planner(request: PlannerRequest):
    """
    Run ONLY the Planner agent — useful for testing.
    Returns the structured plan with subtasks.
    """
    logger.info(f"POST /api/planner — goal='{request.goal[:50]}...'")

    try:
        planner = PlannerAgent()
        result = await planner.create_plan(goal=request.goal)
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Planner failed: {e}")
        return {"success": False, "error": str(e)}


@router.post("/api/researcher")
async def run_researcher(request: ResearcherRequest):
    """
    Run ONLY the Researcher agent on a single subtask.
    Returns research findings with web search results.
    """
    logger.info(f"POST /api/researcher — subtask='{request.subtask[:50]}...'")

    try:
        researcher = ResearcherAgent()
        result = await researcher.research_subtask(
            subtask=request.subtask,
            goal_context=request.goal_context
        )
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Researcher failed: {e}")
        return {"success": False, "error": str(e)}


@router.post("/api/writer")
async def run_writer(request: WriterRequest):
    """
    Run ONLY the Writer agent with provided findings.
    Returns a formatted markdown report.
    """
    logger.info(f"POST /api/writer — goal='{request.goal[:50]}...'")

    try:
        writer = WriterAgent()
        result = await writer.write_report(
            goal=request.goal,
            all_findings=request.findings
        )
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Writer failed: {e}")
        return {"success": False, "error": str(e)}
