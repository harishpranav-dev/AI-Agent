"""
module: test_db.py
purpose: Tests for MongoDB connection and task history operations.
author: HP & Mushan
"""

import pytest
import asyncio
from datetime import datetime, timezone
from db.models import create_task_document, format_task_for_response
from bson import ObjectId


# ============================================
# TESTS FOR models.py
# ============================================

class TestCreateTaskDocument:
    """Tests for create_task_document function."""

    def test_creates_document_with_required_fields(self):
        """Task document should contain all required fields."""
        doc = create_task_document(
            goal="Test goal",
            mode="multi",
            session_id="test-session"
        )

        assert doc["goal"] == "Test goal"
        assert doc["mode"] == "multi"
        assert doc["session_id"] == "test-session"
        assert doc["status"] == "running"
        assert doc["plan"] is None
        assert doc["research"] == []
        assert doc["report"] is None

    def test_generates_unique_task_id(self):
        """Each document should get a unique task_id."""
        doc1 = create_task_document(goal="Goal 1", mode="multi")
        doc2 = create_task_document(goal="Goal 2", mode="multi")

        assert doc1["task_id"] != doc2["task_id"]

    def test_default_session_id(self):
        """Session ID should default to 'default' if not provided."""
        doc = create_task_document(goal="Test", mode="single")

        assert doc["session_id"] == "default"

    def test_metadata_initialized_correctly(self):
        """Metadata fields should start at zero/empty."""
        doc = create_task_document(goal="Test", mode="multi")

        assert doc["metadata"]["total_time_seconds"] == 0
        assert doc["metadata"]["tools_called"] == 0
        assert doc["metadata"]["agents_used"] == []
        assert doc["metadata"]["steps_completed"] == 0
        assert doc["metadata"]["word_count"] == 0

    def test_timestamps_present(self):
        """created_at should be set, completed_at should be None."""
        doc = create_task_document(goal="Test", mode="multi")

        assert doc["created_at"] is not None
        assert doc["completed_at"] is None


class TestFormatTaskForResponse:
    """Tests for format_task_for_response function."""

    def test_converts_objectid_to_string(self):
        """MongoDB ObjectId should be converted to string for JSON."""
        task = {
            "_id": ObjectId(),
            "task_id": "test-123",
            "goal": "Test"
        }
        formatted = format_task_for_response(task)

        assert isinstance(formatted["_id"], str)

    def test_handles_task_without_id(self):
        """Should work fine if _id is not present."""
        task = {"task_id": "test-123", "goal": "Test"}
        formatted = format_task_for_response(task)

        assert formatted["task_id"] == "test-123"

    def test_handles_none_input(self):
        """Should handle None gracefully."""
        result = format_task_for_response(None)

        assert result is None