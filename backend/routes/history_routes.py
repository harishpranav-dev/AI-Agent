"""
module: history_routes.py
purpose: API routes for retrieving task history from MongoDB.
         GET /api/history/{session_id} — all tasks for a session.
         GET /api/history/task/{task_id} — single task details.
author: HP & Mushan
"""

import logging
from fastapi import APIRouter

from db.mongo import get_database

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/api/history/{session_id}")
async def get_session_history(session_id: str):
    """
    Get all tasks for a given browser session, newest first.

    Args:
        session_id: The browser session identifier.

    Returns:
        List of task documents for that session.
    """
    database = get_database()
    if database is None:
        return {"success": False, "error": "Database not available", "tasks": []}

    try:
        cursor = database.tasks.find(
            {"session_id": session_id},
            {"_id": 0}  # Exclude MongoDB's internal _id field
        ).sort("created_at", -1).limit(50)

        tasks = await cursor.to_list(length=50)
        logger.info(f"GET /api/history/{session_id} — returned {len(tasks)} tasks")
        return {"success": True, "tasks": tasks}
    except Exception as e:
        logger.error(f"History fetch failed: {e}")
        return {"success": False, "error": str(e), "tasks": []}


@router.get("/api/history/task/{task_id}")
async def get_task_by_id(task_id: str):
    """
    Get a single task by its unique task_id.

    Args:
        task_id: The UUID of the task.

    Returns:
        The full task document.
    """
    database = get_database()
    if database is None:
        return {"success": False, "error": "Database not available"}

    try:
        task = await database.tasks.find_one(
            {"task_id": task_id},
            {"_id": 0}
        )

        if not task:
            return {"success": False, "error": f"Task {task_id} not found"}

        return {"success": True, "task": task}
    except Exception as e:
        logger.error(f"Task fetch failed: {e}")
        return {"success": False, "error": str(e)}
