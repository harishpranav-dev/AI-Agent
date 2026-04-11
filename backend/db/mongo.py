"""
module: mongo.py
purpose: Manages async MongoDB connection using Motor client.
         Provides get_database() to access the 'autoagent' database.
author: HP & Mushan
"""

import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

# Module-level client — created once, reused across requests
_client: AsyncIOMotorClient | None = None
_database = None


async def connect_to_mongo() -> None:
    """
    Initialize the MongoDB connection.
    Called once at app startup.
    Reads MONGODB_URL from environment variables.
    """
    global _client, _database

    mongo_url = os.getenv("MONGODB_URL", "")
    if not mongo_url:
        logger.warning("MONGODB_URL not set — database features will be unavailable")
        return

    try:
        _client = AsyncIOMotorClient(mongo_url)
        _database = _client["autoagent"]
        # Ping to verify connection actually works
        await _client.admin.command("ping")
        logger.info("Connected to MongoDB Atlas successfully")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        _client = None
        _database = None


async def close_mongo_connection() -> None:
    """
    Close the MongoDB connection.
    Called at app shutdown to free resources.
    """
    global _client, _database
    if _client:
        _client.close()
        _client = None
        _database = None
        logger.info("MongoDB connection closed")


def get_database():
    """
    Returns the 'autoagent' database instance.
    Returns None if connection was never established.
    """
    return _database
