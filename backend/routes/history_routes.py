"""
module: history_routes.py
purpose: API routes for retrieving task history from MongoDB.
         Provides endpoints to list, view, and delete past agent runs.
author: HP & Mushan
"""

import logging
from fastapi import APIRouter
from db.mongo import get_tasks_collection
from db.models import format_task_for_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("/{session_id}")
async def get_session_history(session_id: str, limit: int = 20):
    """
    Get all tasks for a session, most recent first.

    Each browser session has its own history. This endpoint
    returns up to 'limit' tasks sorted newest-first.

    Args:
        session_id: Browser session identifier.
        limit: Maximum number of tasks to return (default 20).

    Returns:
        { success: True, tasks: [...], count: int }
    """
    try:
        collection = get_tasks_collection()

        cursor = collection.find(
            {"session_id": session_id},
            sort=[("created_at", -1)],
            limit=limit
        )

        tasks = []
        async for task in cursor:
            tasks.append(format_task_for_response(task))

        return {"success": True, "tasks": tasks, "count": len(tasks)}

    except Exception as e:
        logger.error(f"History fetch failed: {e}")
        return {"success": False, "error": str(e), "tasks": []}


@router.get("/task/{task_id}")
async def get_task_by_id(task_id: str):
    """
    Get a specific task by its unique task_id.

    Args:
        task_id: The UUID string assigned when the task was created.

    Returns:
        { success: True, task: {...} } or error if not found.
    """
    try:
        collection = get_tasks_collection()
        task = await collection.find_one({"task_id": task_id})

        if not task:
            return {"success": False, "error": "Task not found"}

        return {"success": True, "task": format_task_for_response(task)}

    except Exception as e:
        logger.error(f"Task fetch failed: {e}")
        return {"success": False, "error": str(e)}


@router.delete("/task/{task_id}")
async def delete_task(task_id: str):
    """
    Delete a specific task from history.

    Args:
        task_id: The UUID string of the task to delete.

    Returns:
        { success: True, message: "Task deleted" } or error.
    """
    try:
        collection = get_tasks_collection()
        result = await collection.delete_one({"task_id": task_id})

        if result.deleted_count == 0:
            return {"success": False, "error": "Task not found"}

        return {"success": True, "message": "Task deleted"}

    except Exception as e:
        logger.error(f"Task delete failed: {e}")
        return {"success": False, "error": str(e)}