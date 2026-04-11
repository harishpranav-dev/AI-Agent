"""
module: models.py
purpose: Defines the task document structure for MongoDB storage.
         Provides helper functions to create and update task records.
author: HP & Mushan
"""

import uuid
from datetime import datetime, timezone


def create_task_document(goal: str, mode: str, session_id: str) -> dict:
    """
    Creates a new task document with 'running' status.

    Args:
        goal: The user's original goal text.
        mode: Either 'single' or 'multi' agent mode.
        session_id: Browser session identifier for history tracking.

    Returns:
        A dict ready to insert into MongoDB.
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
            "steps_completed": 0
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": None
    }


def mark_task_complete(task_doc: dict, report: str, metadata: dict) -> dict:
    """
    Updates a task document to 'complete' status with final results.

    Args:
        task_doc: The existing task document dict.
        report: The final markdown report from the Writer agent.
        metadata: Performance stats (time, tools called, etc.)

    Returns:
        The updated task document.
    """
    task_doc["status"] = "complete"
    task_doc["report"] = report
    task_doc["metadata"] = metadata
    task_doc["completed_at"] = datetime.now(timezone.utc).isoformat()
    return task_doc


def mark_task_failed(task_doc: dict, error_message: str) -> dict:
    """
    Updates a task document to 'failed' status with error info.

    Args:
        task_doc: The existing task document dict.
        error_message: Description of what went wrong.

    Returns:
        The updated task document.
    """
    task_doc["status"] = "failed"
    task_doc["metadata"]["error"] = error_message
    task_doc["completed_at"] = datetime.now(timezone.utc).isoformat()
    return task_doc
