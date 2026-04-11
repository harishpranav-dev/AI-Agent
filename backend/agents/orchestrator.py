"""
module: orchestrator.py
purpose: Manages the agent pipeline — coordinates Planner, Researcher,
         and Writer agents in sequence. Supports both 'multi' and 'single' modes.
         
         PHASE 9 UPDATE: Single-agent mode now fully implemented.
         - multi mode: Planner → Researcher (per subtask) → Writer
         - single mode: Planner → Writer (skips research, uses LLM knowledge only)
         
author: HP & Mushan
"""

import json
import time
import asyncio
import logging
from typing import Callable, Optional

from agents.planner_agent import PlannerAgent
from agents.researcher_agent import ResearcherAgent
from agents.writer_agent import WriterAgent
from db.mongo import get_database
from db.models import create_task_document, mark_task_complete, mark_task_failed

logger = logging.getLogger(__name__)

# Retry settings for agent calls
MAX_RETRIES = 2
RETRY_DELAY_SECONDS = 2


async def run_with_retry(agent_callable, *args, **kwargs):
    """
    Run an agent method with automatic retry on failure.
    
    Retries are important because API calls can fail due to
    rate limits, network hiccups, or transient errors.
    Retrying once or twice often resolves these.

    Args:
        agent_callable: The async agent method to call.
        *args, **kwargs: Arguments to pass to the method.

    Returns:
        The agent's return value.

    Raises:
        The last exception if all retries are exhausted.
    """
    for attempt in range(MAX_RETRIES):
        try:
            return await agent_callable(*args, **kwargs)
        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                logger.error(f"Agent call failed after {MAX_RETRIES} attempts: {e}")
                raise
            logger.warning(f"Agent call failed (attempt {attempt + 1}), retrying: {e}")
            await asyncio.sleep(RETRY_DELAY_SECONDS)


def parse_plan_json(raw_plan: str) -> dict:
    """
    Parse the planner's JSON output, handling cases where Claude
    wraps JSON in markdown code blocks.

    Args:
        raw_plan: The raw string output from the Planner agent.

    Returns:
        Parsed dict with goal_summary, subtasks, and complexity.

    Raises:
        ValueError: If the output cannot be parsed as valid JSON.
    """
    cleaned = raw_plan.strip()

    # Strip markdown code block wrappers if present
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        plan = json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse planner output as JSON: {e}")
        logger.error(f"Raw output: {raw_plan[:300]}")
        raise ValueError(f"Planner returned invalid JSON: {e}")

    # Validate required fields
    if "subtasks" not in plan or not isinstance(plan["subtasks"], list):
        raise ValueError("Planner output missing 'subtasks' list")

    if len(plan["subtasks"]) < 1:
        raise ValueError("Planner produced zero subtasks")

    return plan


class Orchestrator:
    """
    Pipeline manager for the agent system.
    
    No intelligence of its own — it just coordinates:
    1. Sends goal to Planner → gets structured plan
    2. (Multi mode) Sends each subtask to Researcher → collects findings
    3. Sends findings to Writer → gets final report
    4. Saves everything to MongoDB
    5. Emits WebSocket events throughout

    In SINGLE mode, step 2 is skipped — the Writer works from
    the plan alone, using only Claude's built-in knowledge.
    This demonstrates the difference between single-step (less accurate,
    faster) and multi-step (more accurate, slower with real data).
    """

    def __init__(self):
        """Initialize all three agents."""
        self.planner = PlannerAgent()
        self.researcher = ResearcherAgent()
        self.writer = WriterAgent()

    async def run(
        self,
        goal: str,
        mode: str = "multi",
        session_id: str = "default",
        event_callback: Optional[Callable] = None
    ) -> dict:
        """
        Execute the full agent pipeline.

        Args:
            goal: The user's raw goal string.
            mode: 'multi' (Planner+Researcher+Writer) or
                  'single' (Planner+Writer only).
            session_id: Browser session ID for history tracking.
            event_callback: Async function to emit WebSocket events.

        Returns:
            Dict with task_id, report, and metadata.
        """
        start_time = time.time()
        tools_called = 0

        # Create task record in MongoDB
        task_doc = create_task_document(goal, mode, session_id)
        task_id = task_doc["task_id"]
        database = get_database()

        if database:
            try:
                await database.tasks.insert_one(task_doc)
            except Exception as e:
                logger.error(f"Failed to save initial task to MongoDB: {e}")

        # Emit: task started
        if event_callback:
            await event_callback("task_started", {
                "task_id": task_id,
                "goal": goal,
                "mode": mode
            })

        try:
            # ── STEP 1: PLANNER ──────────────────────────────
            logger.info(f"[Orchestrator] Starting Planner for: {goal[:50]}...")
            raw_plan = await run_with_retry(
                self.planner.create_plan,
                goal=goal,
                event_callback=event_callback
            )
            plan = parse_plan_json(raw_plan)
            task_doc["plan"] = plan

            agents_used = ["planner"]

            # ── STEP 2: RESEARCHER (multi mode only) ─────────
            all_findings = []

            if mode == "multi":
                logger.info(f"[Orchestrator] Multi mode — researching {len(plan['subtasks'])} subtasks")
                agents_used.append("researcher")

                for subtask in plan["subtasks"]:
                    finding = await run_with_retry(
                        self.researcher.research_subtask,
                        subtask=subtask,
                        goal_context=goal,
                        event_callback=event_callback
                    )
                    all_findings.append(finding)
                    tools_called += 1  # At minimum, each subtask calls web_search once

                task_doc["research"] = [
                    {"subtask": s, "findings": f[:200]}
                    for s, f in zip(plan["subtasks"], all_findings)
                ]
            else:
                # Single mode — no research, Writer uses LLM knowledge only
                logger.info("[Orchestrator] Single mode — skipping Researcher")
                if event_callback:
                    await event_callback("researcher_skipped", {
                        "reason": "Single-agent mode — using AI knowledge only"
                    })
                # Pass the subtasks as pseudo-findings so Writer has structure
                all_findings = [
                    f"Subtask to address (no web research — use your knowledge): {subtask}"
                    for subtask in plan["subtasks"]
                ]

            # ── STEP 3: WRITER ───────────────────────────────
            logger.info("[Orchestrator] Starting Writer agent")
            agents_used.append("writer")

            report = await run_with_retry(
                self.writer.write_report,
                goal=goal,
                all_findings=all_findings,
                event_callback=event_callback
            )

            # ── STEP 4: SAVE RESULT ─────────────────────────
            elapsed = round(time.time() - start_time, 2)
            metadata = {
                "total_time_seconds": elapsed,
                "tools_called": tools_called,
                "agents_used": agents_used,
                "steps_completed": len(plan["subtasks"]) + 2  # plan + research steps + write
            }

            mark_task_complete(task_doc, report, metadata)

            if database:
                try:
                    await database.tasks.update_one(
                        {"task_id": task_id},
                        {"$set": task_doc}
                    )
                except Exception as e:
                    logger.error(f"Failed to update task in MongoDB: {e}")

            # ── STEP 5: EMIT COMPLETION ──────────────────────
            result = {
                "task_id": task_id,
                "goal": goal,
                "mode": mode,
                "report": report,
                "plan": plan,
                "metadata": metadata
            }

            if event_callback:
                await event_callback("task_complete", result)

            logger.info(f"[Orchestrator] Task complete in {elapsed}s — {mode} mode")
            return result

        except Exception as e:
            # ── ERROR HANDLING ───────────────────────────────
            elapsed = round(time.time() - start_time, 2)
            error_msg = str(e)
            logger.error(f"[Orchestrator] Task failed after {elapsed}s: {error_msg}")

            mark_task_failed(task_doc, error_msg)

            if database:
                try:
                    await database.tasks.update_one(
                        {"task_id": task_id},
                        {"$set": task_doc}
                    )
                except Exception:
                    pass  # Don't let DB error mask the real error

            if event_callback:
                await event_callback("task_error", {
                    "task_id": task_id,
                    "error": error_msg
                })

            return {
                "task_id": task_id,
                "goal": goal,
                "mode": mode,
                "report": None,
                "error": error_msg,
                "metadata": {"total_time_seconds": elapsed}
            }
