"""
module: writer_agent.py
purpose: Implements the Writer Agent that takes research findings
         and produces a clean, structured markdown report.
author: HP & Mushan
"""

import logging
from agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)

WRITER_SYSTEM_PROMPT = """You are a professional technical writer and analyst.
You receive a goal and compiled research findings, and produce
a clean, structured, insightful report.

Rules:
- Always start with an Executive Summary
- Use clear markdown headers and sections
- Integrate all research findings naturally
- Add analysis — don't just list facts
- End with a Conclusion and key takeaways
- Minimum 400 words, maximum 1200 words
- No fluff, no padding — every sentence must add value
- Cite sources inline where relevant"""


class WriterAgent(BaseAgent):
    """
    Communicator agent. Takes compiled research findings and the
    original goal, then produces a polished markdown report.

    Like a technical writer who receives research notes from a team
    and writes a clean, professional document.
    """

    def __init__(self):
        """Initialize with writer system prompt and no tools."""
        super().__init__(
            name="Writer",
            system_prompt=WRITER_SYSTEM_PROMPT,
            tools=[]  # Writer only writes — no tool use needed
        )

    async def write_report(
        self,
        goal: str,
        all_findings: list,
        event_callback=None
    ) -> str:
        """
        Produce a structured report from research findings.

        Args:
            goal: The original user goal.
            all_findings: List of research result strings from Researcher.
            event_callback: Optional async function for progress events.

        Returns:
            Markdown-formatted report string.
        """
        # Build a comprehensive prompt with all research data
        findings_text = "\n\n---\n\n".join(
            f"Research Finding {i+1}:\n{finding}"
            for i, finding in enumerate(all_findings)
        )

        prompt = (
            f"Write a comprehensive research report.\n\n"
            f"Original Goal: {goal}\n\n"
            f"Research Findings:\n{findings_text}\n\n"
            f"Produce a well-structured markdown report with all findings integrated."
        )

        if event_callback:
            await event_callback("writer_thinking", {
                "goal": goal,
                "findings_count": len(all_findings)
            })

        result = await self.run(
            user_message=prompt,
            event_callback=event_callback
        )

        if event_callback:
            await event_callback("writer_complete", {
                "report_preview": result[:200],
                "word_count": len(result.split())
            })

        logger.info(f"[Writer] Report complete — {len(result.split())} words")
        return result
