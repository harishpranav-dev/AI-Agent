"""
module: agent_routes.py
purpose: API routes for agent operations.
author: HP & Mushan
"""

from fastapi import APIRouter
from agents.test_agent import TestAgent

router = APIRouter(prefix="/api", tags=["agents"])


@router.post("/test-agent")
async def test_agent(payload: dict):
    """
    Test endpoint — verifies Claude API connection.
    Body: { "question": "your question here" }
    """
    try:
        agent = TestAgent()
        result = await agent.run(payload)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}