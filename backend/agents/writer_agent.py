"""
module: writer_agent.py
purpose: Writer Agent — takes a goal and all research findings,
         produces a clean, structured markdown report.
author: HP & Mushan
"""

import logging
from agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)

WRITER_SYSTEM_PROMPT = """
You are a professional technical writer and analyst.

You receive a research goal and compiled findings from a research team.
Your job is to transform raw research into a polished, insightful report.

RULES:
1. Always start with an Executive Summary (3-4 sentences)
2. Use clear markdown headers: ##, ###
3. Integrate ALL research findings — don't ignore any
4. Add analysis — connect findings, identify patterns, draw conclusions
5. Include a dedicated Statistics/Data section if statistics were found
6. End with a strong Conclusion with 3-5 key takeaways
7. Cite sources inline: "According to [Source]..."
8. Length: 400-1000 words — quality over quantity
9. No fluff, no padding — every sentence adds value
10. Write in a professional but accessible tone

Report structure:
# [Title Based on Goal]
## Executive Summary
## Key Findings
## [Relevant thematic sections]
## Data & Statistics (if applicable)
## Analysis
## Conclusion
### Key Takeaways
"""


class WriterAgent(BaseAgent):
    """
    Writer Agent: Produces final structured reports from research findings.
    Third and final agent in the multi-agent pipeline.

    The Writer receives:
      - The original user goal
      - All research findings from the Researcher Agent
    And produces:
      - A polished markdown report with executive summary, analysis, and conclusions
    """

    def __init__(self):
        """Initialize Writer Agent with its system prompt. No tools needed."""
        super().__init__(
            name="Writer Agent",
            system_prompt=WRITER_SYSTEM_PROMPT
        )

    def _build_research_summary(self, all_findings: list) -> str:
        """
        Format all research findings into a readable summary for the writer.

        Takes the raw list of researcher outputs and formats them into
        a clean text block that Claude can easily read and synthesize.

        Args:
            all_findings: List of dicts from the Researcher Agent,
                          each containing subtask, key_findings, statistics, sources.

        Returns:
            A formatted string summarizing all research data.
        """
        summary_parts: list[str] = []

        for i, finding in enumerate(all_findings, 1):
            # Skip failed research results — don't pass bad data to the writer
            if not finding.get("success", False):
                continue

            data = finding.get("findings", {})
            subtask_label = data.get("subtask", "Unknown")
            section_lines: list[str] = [
                f"\n--- Research Area {i}: {subtask_label} ---"
            ]

            # Add key findings as bullet points
            for key_finding in data.get("key_findings", []):
                section_lines.append(f"• {key_finding}")

            # Add statistics with a visual indicator
            for stat in data.get("statistics", []):
                section_lines.append(f"📊 {stat}")

            # Add sources for citation
            for source in data.get("sources", []):
                section_lines.append(f"Source: {source}")

            summary_parts.append("\n".join(section_lines))

        return "\n".join(summary_parts)

    async def run(self, input_data: dict) -> dict:
        """
        Generate the final report from research findings.

        This is the main entry point for the Writer Agent. It:
        1. Validates that we have a goal and findings
        2. Formats all findings into a readable summary
        3. Sends everything to Claude to write the report
        4. Returns the markdown report with word count

        Args:
            input_data: {
                "goal": "original user goal",
                "all_findings": [ list of researcher outputs ]
            }

        Returns:
            {
              "success": bool,
              "report": "markdown string",
              "word_count": int,
              "agent": "Writer Agent"
            }
        """
        goal = input_data.get("goal", "").strip()
        all_findings = input_data.get("all_findings", [])

        # --- Input validation ---
        if not goal:
            return {
                "success": False,
                "error": "Goal is required",
                "agent": self.name
            }

        if not all_findings:
            return {
                "success": False,
                "error": "No research findings provided",
                "agent": self.name
            }

        # --- Build the research summary for Claude ---
        research_summary = self._build_research_summary(all_findings)

        # Check if ALL findings were failures (nothing useful to write about)
        if not research_summary.strip():
            return {
                "success": False,
                "error": "All research findings failed — nothing to write about",
                "agent": self.name
            }

        logger.info(f"Writer: Generating report for goal: '{goal[:50]}...'")

        # --- Build the message for Claude ---
        messages = [
            {
                "role": "user",
                "content": (
                    f"Write a comprehensive research report for this goal:\n"
                    f"GOAL: {goal}\n\n"
                    f"RESEARCH FINDINGS:\n{research_summary}\n\n"
                    f"Produce the complete markdown report now."
                )
            }
        ]

        try:
            # Call Claude — no tools needed, pure writing task
            report = await self.call_claude(messages, max_tokens=3000)
            word_count = len(report.split())

            logger.info(f"Writer: Report generated — {word_count} words")

            return {
                "success": True,
                "report": report,
                "word_count": word_count,
                "agent": self.name
            }

        except Exception as e:
            logger.error(f"Writer: Error generating report: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }