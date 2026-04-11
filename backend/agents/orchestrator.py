"""
module: orchestrator.py
purpose: Orchestrator manages the full multi-agent pipeline.
         Coordinates: Planner → Researcher (per subtask) → Writer.
         Emits progress events and manages task memory.
         This is the "project manager" — it coordinates but never thinks.
author: HP & Mushan
"""

import uuid
import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional, Callable

from agents.planner_agent import PlannerAgent
from agents.researcher_agent import ResearcherAgent
from agents.writer_agent import WriterAgent
from db.mongo import get_tasks_collection

logger = logging.getLogger(__name__)


class Orchestrator:
    """
    Manages the full multi-agent pipeline for AutoAgent Studio.

    Pipeline flow:
        1. Planner Agent → breaks goal into subtasks
        2. Researcher Agent → researches each subtask (with web search)
        3. Writer Agent → produces final markdown report

    The Orchestrator itself has NO intelligence — it only:
        - Calls agents in order
        - Passes outputs between them
        - Tracks progress via events
        - Handles errors gracefully
    """

    def __init__(self, event_callback: Optional[Callable] = None):
        """
        Initialize the Orchestrator with all three agents.

        Args:
            event_callback: Optional async function called with progress events.
                           Signature: async def callback(event_type: str, data: dict)
                           Used later for WebSocket streaming to the frontend.
        """
        self.planner = PlannerAgent()
        self.researcher = ResearcherAgent()
        self.writer = WriterAgent()
        self.event_callback = event_callback

    async def emit(self, event_type: str, data: dict) -> None:
        """
        Emit a progress event to the console and optional callback.

        Events let the frontend (and logs) know what's happening
        at each step of the pipeline. Example event types:
        "planner_thinking", "researcher_complete", "task_error", etc.

        Args:
            event_type: Name of the event (e.g., "planner_complete")
            data: Dict of event-specific data to send
        """
        event = {
            "event": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": data
        }
        logger.info(f"Event: {event_type} — {str(data)[:100]}")

        if self.event_callback:
            await self.event_callback(event_type, data)

    async def run(self, goal: str, mode: str = "multi") -> dict:
        """
        Run the full agent pipeline.

        This is the main entry point. It:
        1. Creates a unique task ID and memory object
        2. Runs the Planner to get subtasks
        3. Runs the Researcher on each subtask (multi mode only)
        4. Runs the Writer to produce the final report
        5. Saves the completed task to MongoDB
        6. Returns the complete result with stats

        Args:
            goal: User's research goal (e.g., "Research benefits of meditation")
            mode: "multi" for full 3-agent pipeline,
                  "single" for Planner + Writer only (skips research)

        Returns:
            {
              "success": True/False,
              "task_id": str,
              "goal": str,
              "plan": dict,
              "report": str,
              "stats": dict
            }
        """
        task_id = str(uuid.uuid4())[:8]
        start_time = datetime.now(timezone.utc)

        # --- Task Memory: tracks everything across the pipeline ---
        # This dict travels through the entire pipeline, collecting
        # outputs from each agent. It's the "shared clipboard" that
        # the Orchestrator manages.
        task_memory = {
            "task_id": task_id,
            "goal": goal,
            "mode": mode,
            "plan": None,
            "all_findings": [],
            "report": None,
            "error": None,
            "stats": {
                "tools_called": 0,
                "steps_completed": 0,
                "agents_used": []
            }
        }

        logger.info(f"Orchestrator: Starting task {task_id} — '{goal[:50]}'")

        await self.emit("task_started", {
            "task_id": task_id,
            "goal": goal,
            "mode": mode
        })

        try:
            # ========================================
            # STEP 1: PLANNER AGENT
            # ========================================
            await self.emit("planner_thinking", {
                "message": "Breaking down your goal into subtasks..."
            })

            planner_result = await self.planner.run({"goal": goal})

            if not planner_result["success"]:
                raise Exception(
                    f"Planner failed: {planner_result.get('error')}"
                )

            task_memory["plan"] = planner_result["plan"]
            task_memory["stats"]["steps_completed"] += 1
            task_memory["stats"]["agents_used"].append("planner")

            await self.emit("planner_complete", {
                "plan": planner_result["plan"],
                "subtask_count": len(planner_result["plan"]["subtasks"])
            })

            # ========================================
            # STEP 2: RESEARCHER AGENT (per subtask)
            # Skip this step in "single" mode
            # ========================================
            if mode == "multi":
                subtasks = planner_result["plan"]["subtasks"]

                for i, subtask in enumerate(subtasks):
                    await self.emit("researcher_thinking", {
                        "subtask": subtask,
                        "progress": f"{i + 1}/{len(subtasks)}"
                    })

                    research_result = await self.researcher.run({
                        "subtask": subtask,
                        "goal_context": goal
                    })

                    if research_result["success"]:
                        task_memory["all_findings"].append(research_result)
                        task_memory["stats"]["tools_called"] += 1

                    task_memory["stats"]["steps_completed"] += 1

                    await self.emit("researcher_complete", {
                        "subtask": subtask,
                        "findings_count": len(
                            research_result.get("findings", {})
                            .get("key_findings", [])
                        )
                    })

                    # Brief pause between subtask research calls
                    # Avoids hitting API rate limits too fast
                    await asyncio.sleep(0.5)

                task_memory["stats"]["agents_used"].append("researcher")

            # ========================================
            # STEP 3: WRITER AGENT
            # ========================================
            await self.emit("writer_thinking", {
                "message": "Writing your report..."
            })

            # In single mode, the Writer gets a minimal finding
            # since the Researcher was skipped entirely
            writer_findings = task_memory["all_findings"]
            if mode == "single":
                writer_findings = [{
                    "success": True,
                    "findings": {
                        "subtask": "Direct analysis",
                        "key_findings": [
                            f"Single-agent mode: direct analysis of '{goal}'"
                        ],
                        "statistics": [],
                        "sources": []
                    }
                }]

            writer_result = await self.writer.run({
                "goal": goal,
                "all_findings": writer_findings
            })

            if not writer_result["success"]:
                raise Exception(
                    f"Writer failed: {writer_result.get('error')}"
                )

            task_memory["report"] = writer_result["report"]
            task_memory["stats"]["steps_completed"] += 1
            task_memory["stats"]["agents_used"].append("writer")

            # ========================================
            # STEP 4: CALCULATE STATS AND RETURN
            # ========================================
            end_time = datetime.now(timezone.utc)
            duration = (end_time - start_time).seconds
            task_memory["stats"]["total_seconds"] = duration

            await self.emit("task_complete", {
                "task_id": task_id,
                "report": writer_result["report"],
                "word_count": writer_result["word_count"],
                "duration_seconds": duration,
                "stats": task_memory["stats"]
            })

            # --- Save completed task to MongoDB ---
            try:
                collection = get_tasks_collection()
                doc = {
                    "task_id": task_id,
                    "session_id": "default",
                    "goal": goal,
                    "mode": mode,
                    "status": "complete",
                    "plan": task_memory["plan"],
                    "research": [
                        f.get("findings", {})
                        for f in task_memory["all_findings"]
                    ],
                    "report": task_memory["report"],
                    "metadata": {
                        "total_time_seconds": duration,
                        "tools_called": task_memory["stats"]["tools_called"],
                        "agents_used": task_memory["stats"]["agents_used"],
                        "steps_completed": task_memory["stats"]["steps_completed"],
                        "word_count": writer_result.get("word_count", 0)
                    },
                    "created_at": start_time.isoformat(),
                    "completed_at": end_time.isoformat()
                }
                await collection.insert_one(doc)
                logger.info(f"Task {task_id} saved to MongoDB")
            except Exception as e:
                logger.warning(f"Failed to save task to MongoDB: {e}")

            return {
                "success": True,
                "task_id": task_id,
                "goal": goal,
                "plan": task_memory["plan"],
                "report": task_memory["report"],
                "stats": task_memory["stats"]
            }

        except Exception as e:
            logger.error(
                f"Orchestrator: Task {task_id} failed: {e}",
                exc_info=True
            )
            await self.emit("task_error", {
                "error": str(e),
                "task_id": task_id
            })
            return {
                "success": False,
                "task_id": task_id,
                "error": str(e),
                "partial_data": task_memory
            }