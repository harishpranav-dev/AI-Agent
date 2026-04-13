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

@router.get("/api/stats/{session_id}")
async def get_session_stats(session_id: str):
    """
    Aggregate performance stats for all completed tasks in a session.

    Queries MongoDB for all tasks with status 'complete' for this session,
    then calculates totals and averages. The frontend StatsDashboard
    component consumes this data.

    Args:
        session_id: The browser session identifier.

    Returns:
        Dict with total_tasks, avg_time, tools_called, and mode breakdown.
    """
    database = get_database()
    if database is None:
        return {"success": False, "error": "Database not available"}

    try:
        tasks = await database.tasks.find(
            {"session_id": session_id, "status": "complete"},
            {"_id": 0, "metadata": 1, "mode": 1}
        ).to_list(length=100)

        if not tasks:
            return {
                "success": True,
                "stats": {
                    "total_tasks": 0,
                    "avg_time_seconds": 0,
                    "total_tools_called": 0,
                    "multi_agent_runs": 0,
                    "single_agent_runs": 0,
                }
            }

        total = len(tasks)
        avg_time = sum(
            t.get("metadata", {}).get("total_time_seconds", 0) for t in tasks
        ) / total
        total_tools = sum(
            t.get("metadata", {}).get("tools_called", 0) for t in tasks
        )
        multi_count = sum(1 for t in tasks if t.get("mode") == "multi")

        return {
            "success": True,
            "stats": {
                "total_tasks": total,
                "avg_time_seconds": round(avg_time, 1),
                "total_tools_called": total_tools,
                "multi_agent_runs": multi_count,
                "single_agent_runs": total - multi_count,
            }
        }

    except Exception as e:
        logger.error(f"Stats fetch failed: {e}", exc_info=True)
        return {"success": False, "error": "Failed to fetch stats"}