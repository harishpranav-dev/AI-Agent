"""
module: mongo.py
purpose: MongoDB async connection manager for AutoAgent Studio.
         Uses Motor (async PyMongo driver) for non-blocking DB operations.
author: HP & Mushan
"""

import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

_client = None
_db = None


async def connect_db():
    """
    Initialize MongoDB connection. Call on app startup.
    
    Creates an async Motor client and pings the server
    to verify the connection is working.
    """
    global _client, _db

    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

    try:
        _client = AsyncIOMotorClient(mongodb_url)
        _db = _client.autoagent

        # Test connection — ping throws an error if MongoDB is unreachable
        await _client.admin.command("ping")
        logger.info("MongoDB connected successfully")

    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        raise


async def close_db():
    """Close MongoDB connection. Call on app shutdown."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed")


def get_db():
    """
    Get the database instance.
    
    Returns:
        The 'autoagent' database object.
        
    Raises:
        RuntimeError: If connect_db() hasn't been called yet.
    """
    if _db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _db


def get_tasks_collection():
    """
    Get the tasks collection from the database.
    
    Returns:
        The 'tasks' collection where all completed agent runs are stored.
    """
    return get_db()["tasks"]