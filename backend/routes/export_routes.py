"""
module: export_routes.py
purpose: Provides PDF export endpoint for completed agent task reports.
         Fetches a task from MongoDB, converts the markdown report into
         a styled PDF using fpdf2 with Unicode font support, and returns
         it as a downloadable file.
author: HP & Mushan
"""

import re
import os
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from fpdf import FPDF

from db.mongo import get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/export", tags=["export"])


def sanitize_text(text: str) -> str:
    """
    Replace problematic Unicode characters with safe ASCII equivalents.
    This ensures the PDF renders correctly even with Helvetica fallback.

    Args:
        text: Raw text that may contain special Unicode characters.

    Returns:
        Cleaned text safe for PDF rendering.
    """
    replacements = {
        "\u2014": "--",       # em dash
        "\u2013": "-",        # en dash
        "\u2018": "'",        # left single quote
        "\u2019": "'",        # right single quote
        "\u201c": '"',        # left double quote
        "\u201d": '"',        # right double quote
        "\u2026": "...",      # ellipsis
        "\u00a0": " ",        # non-breaking space
        "\u2022": "-",        # bullet
        "\u2713": "[x]",      # checkmark
        "\u2717": "[ ]",      # cross mark
        "\u00b7": "-",        # middle dot
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    return text


class ReportPDF(FPDF):
    """
    Custom PDF class with branded header/footer on every page.
    Tries to load DejaVu font for Unicode support; falls back
    to Helvetica with text sanitization if unavailable.
    """

    def __init__(self, goal: str, mode: str, date_str: str):
        """
        Initialize with task metadata and attempt to load Unicode fonts.

        Args:
            goal: The user's original goal string.
            mode: 'single' or 'multi' agent mode.
            date_str: Date string for display (e.g. '2025-04-12').
        """
        super().__init__()
        self.goal = goal
        self.mode = mode
        self.date_str = date_str
        self.unicode_supported = False

        # Try to load DejaVu for full Unicode support
        regular_path = self._find_font("DejaVuSans.ttf")
        bold_path = self._find_font("DejaVuSans-Bold.ttf")

        if regular_path:
            try:
                self.add_font("DejaVu", "", regular_path)
                if bold_path:
                    self.add_font("DejaVu", "B", bold_path)
                else:
                    self.add_font("DejaVu", "B", regular_path)
                self.unicode_supported = True
                self.font_family_name = "DejaVu"
                logger.info("Loaded DejaVu font for Unicode PDF support")
            except Exception as e:
                logger.warning(f"Failed to load DejaVu font: {e}")
                self.font_family_name = "Helvetica"
        else:
            self.font_family_name = "Helvetica"
            logger.info("Using Helvetica font (ASCII only)")

    def _find_font(self, filename: str) -> str | None:
        """
        Search common font directories for a given font file.

        Args:
            filename: Font filename to search for.

        Returns:
            Full path to the font file, or None if not found.
        """
        search_dirs = [
            "/usr/share/fonts/truetype/dejavu/",
            "/usr/share/fonts/TTF/",
            "C:/Windows/Fonts/",
            os.path.expanduser("~/.fonts/"),
        ]
        for directory in search_dirs:
            path = os.path.join(directory, filename)
            if os.path.isfile(path):
                return path
        return None

    def safe_text(self, text: str) -> str:
        """
        Make text safe for the current font.

        Args:
            text: Raw text string.

        Returns:
            Font-safe text string.
        """
        if self.unicode_supported:
            return text
        return sanitize_text(text)

    def header(self):
        """Render branded header with task metadata on every page."""
        self.set_font(self.font_family_name, "B", 9)
        self.set_text_color(124, 92, 252)
        self.cell(0, 6, "AutoAgent Studio", new_x="LMARGIN", new_y="NEXT")

        self.set_font(self.font_family_name, "", 7)
        self.set_text_color(140, 140, 140)
        meta_line = self.safe_text(
            f"Goal: {self.goal[:90]}  |  Mode: {self.mode}  |  {self.date_str}"
        )
        self.cell(0, 4, meta_line, new_x="LMARGIN", new_y="NEXT")

        self.set_draw_color(230, 230, 230)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(6)

    def footer(self):
        """Render page number and branding in the footer."""
        self.set_y(-15)
        self.set_font(self.font_family_name, "", 7)
        self.set_text_color(170, 170, 170)
        self.cell(
            0, 10,
            f"Generated by AutoAgent Studio  |  Page {self.page_no()}/{{nb}}",
            align="C",
        )


def parse_markdown_to_pdf(pdf: ReportPDF, markdown_text: str) -> None:
    """
    Parse a markdown string and write it into the PDF with formatting:
    headings (h1-h3), bold text, bullets, numbered lists, horizontal
    rules, and regular paragraphs.

    Args:
        pdf: The ReportPDF instance to write into.
        markdown_text: Raw markdown string from the agent report.
    """
    font = pdf.font_family_name
    lines = markdown_text.split("\n")

    for line in lines:
        stripped = line.strip()

        if not stripped:
            pdf.ln(3)
            continue

        # ── H1 ──
        if stripped.startswith("# ") and not stripped.startswith("##"):
            pdf.set_font(font, "B", 18)
            pdf.set_text_color(124, 92, 252)
            pdf.multi_cell(0, 8, pdf.safe_text(stripped[2:].strip()))
            pdf.ln(2)

        # ── H2 ──
        elif stripped.startswith("## "):
            pdf.set_font(font, "B", 14)
            pdf.set_text_color(50, 50, 50)
            pdf.ln(3)
            pdf.multi_cell(0, 7, pdf.safe_text(stripped[3:].strip()))
            pdf.set_draw_color(230, 230, 230)
            pdf.line(10, pdf.get_y() + 1, 200, pdf.get_y() + 1)
            pdf.ln(3)

        # ── H3 ──
        elif stripped.startswith("### "):
            pdf.set_font(font, "B", 12)
            pdf.set_text_color(80, 80, 80)
            pdf.ln(2)
            pdf.multi_cell(0, 6, pdf.safe_text(stripped[4:].strip()))
            pdf.ln(2)

        # ── Bullet points ──
        elif stripped.startswith("- ") or stripped.startswith("* "):
            pdf.set_font(font, "", 10)
            pdf.set_text_color(30, 30, 30)
            bullet_text = stripped[2:].strip()
            bullet_text = re.sub(r"\*\*(.*?)\*\*", r"\1", bullet_text)
            pdf.cell(8)
            pdf.multi_cell(0, 5.5, pdf.safe_text(f"-  {bullet_text}"))
            pdf.ln(1)

        # ── Numbered list ──
        elif re.match(r"^\d+\.\s", stripped):
            pdf.set_font(font, "", 10)
            pdf.set_text_color(30, 30, 30)
            clean_text = re.sub(r"\*\*(.*?)\*\*", r"\1", stripped)
            pdf.cell(8)
            pdf.multi_cell(0, 5.5, pdf.safe_text(clean_text))
            pdf.ln(1)

        # ── Horizontal rule ──
        elif stripped in ("---", "***", "___"):
            pdf.ln(2)
            pdf.set_draw_color(200, 200, 200)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(4)

        # ── Regular paragraph ──
        else:
            pdf.set_font(font, "", 10)
            pdf.set_text_color(30, 30, 30)
            clean_text = re.sub(r"\*\*(.*?)\*\*", r"\1", stripped)
            pdf.multi_cell(0, 5.5, pdf.safe_text(clean_text))
            pdf.ln(1)


@router.get("/pdf/{task_id}")
async def export_task_as_pdf(task_id: str):
    """
    Export a completed task report as a downloadable PDF file.

    Fetches the task from MongoDB by task_id, converts the markdown
    report into a styled PDF, and returns it as a browser download.

    Args:
        task_id: The UUID string identifying the task.

    Returns:
        A PDF file response with Content-Disposition: attachment.
    """
    try:
        database = get_database()
        if database is None:
            raise HTTPException(status_code=503, detail="Database not connected")
        collection = database["tasks"]
        task = await collection.find_one({"task_id": task_id})

        # ── Validate ──
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        if not task.get("report"):
            raise HTTPException(status_code=404, detail="Task has no report to export")

        # ── Parse date ──
        date_str = "Unknown date"
        if task.get("created_at"):
            try:
                date_str = str(task["created_at"])[:10]
            except (IndexError, TypeError):
                date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        # ── Build PDF ──
        pdf = ReportPDF(
            goal=task.get("goal", "No goal specified"),
            mode=task.get("mode", "unknown"),
            date_str=date_str,
        )
        pdf.alias_nb_pages()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=20)

        parse_markdown_to_pdf(pdf, task["report"])

        pdf_bytes = pdf.output()

        logger.info(f"PDF exported for task {task_id}, size={len(pdf_bytes)} bytes")

        return Response(
            content=bytes(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="report_{task_id[:8]}.pdf"'
                )
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        # Log the full exception internally but return a generic message.
        logger.error(f"PDF export failed for task {task_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="PDF generation failed")