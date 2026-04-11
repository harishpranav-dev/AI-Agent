"""
module: models.py
purpose: Data models and helper functions for task documents.
         Defines the structure of task records saved to MongoDB.
author: HP & Mushan
"""

from datetime import datetime, timezone
import uuid


def create_task_document(
    goal: str,
    mode: str,
    session_id: str = "default"
) -> dict:
    """
    Create a new task document ready for MongoDB insertion.

    This is the blueprint for every task saved to the database.
    It starts with status 'running' and gets updated when the
    orchestrator completes or fails.

    Args:
        goal: User's research goal (e.g., "Research benefits of yoga")
        mode: "multi" (3-agent pipeline) or "single" (planner + writer only)
        session_id: Browser session identifier for grouping user history

    Returns:
        Task document dict matching the MongoDB schema.
    """
    return {
        "task_id": str(uuid.uuid4()),
        "session_id": session_id,
        "mode": mode,
        "goal": goal,
        "status": "running",
        "plan": None,
        "research": [],
        "report": None,
        "metadata": {
            "total_time_seconds": 0,
            "tools_called": 0,
            "agents_used": [],
            "steps_completed": 0,
            "word_count": 0
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": None
    }


def format_task_for_response(task: dict) -> dict:
    """
    Format a MongoDB task document for API response.

    MongoDB adds an '_id' field (ObjectId type) to every document.
    ObjectId isn't JSON-serializable, so we convert it to a string.

    Args:
        task: Raw task document from MongoDB.

    Returns:
        Same dict with _id converted to string.
    """
    if task and "_id" in task:
        task["_id"] = str(task["_id"])
    return task