"""
module: test_models.py
purpose: Tests for task document creation and status updates.
author: HP & Mushan
"""

import pytest
from db.models import create_task_document, mark_task_complete, mark_task_failed


class TestCreateTaskDocument:
    """Test task document creation."""

    def test_creates_document_with_required_fields(self):
        """New task document should have all required fields."""
        doc = create_task_document("Test goal", "multi", "session-123")
        assert doc["goal"] == "Test goal"
        assert doc["mode"] == "multi"
        assert doc["session_id"] == "session-123"
        assert doc["status"] == "running"
        assert doc["task_id"]  # Should have a UUID
        assert doc["created_at"]  # Should have a timestamp
        assert doc["completed_at"] is None

    def test_creates_unique_task_ids(self):
        """Each task should get a unique task_id."""
        doc1 = create_task_document("Goal 1", "multi", "session-1")
        doc2 = create_task_document("Goal 2", "multi", "session-1")
        assert doc1["task_id"] != doc2["task_id"]


class TestMarkTaskComplete:
    """Test marking tasks as complete."""

    def test_marks_status_complete(self):
        """Completed task should have status='complete' and a report."""
        doc = create_task_document("Test", "multi", "s1")
        metadata = {"total_time_seconds": 10, "tools_called": 3}
        mark_task_complete(doc, "# Report content", metadata)
        assert doc["status"] == "complete"
        assert doc["report"] == "# Report content"
        assert doc["completed_at"] is not None


class TestMarkTaskFailed:
    """Test marking tasks as failed."""

    def test_marks_status_failed(self):
        """Failed task should have status='failed' and error info."""
        doc = create_task_document("Test", "multi", "s1")
        mark_task_failed(doc, "API timeout")
        assert doc["status"] == "failed"
        assert doc["metadata"]["error"] == "API timeout"
        assert doc["completed_at"] is not None
