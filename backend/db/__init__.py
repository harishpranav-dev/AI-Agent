"""
package: db
purpose: Exposes the MongoDB connection helpers and the task document
         schema used across the backend. Import from this package
         instead of reaching into individual modules.
author: HP & Mushan
"""

from db.mongo import (
    connect_to_mongo,
    close_mongo_connection,
    get_database,
)
from db.models import (
    create_task_document,
    mark_task_complete,
    mark_task_failed,
    format_task_for_response,
)

__all__ = [
    "connect_to_mongo",
    "close_mongo_connection",
    "get_database",
    "create_task_document",
    "mark_task_complete",
    "mark_task_failed",
    "format_task_for_response",
]
