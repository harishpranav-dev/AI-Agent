"""
module: websocket_manager.py
purpose: Manages WebSocket connections and broadcasts real-time events
         to connected browser clients during agent execution.
author: HP & Mushan
"""

import json
import logging
from typing import Dict
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class WebSocketManager:
    """
    Tracks active WebSocket connections by client_id.
    Provides methods to send typed events to specific clients.
    
    Think of it like a switchboard operator — when an agent does
    something, the manager routes the update to the right browser tab.
    """

    def __init__(self):
        """Initialize with empty connections dict."""
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        """
        Accept a new WebSocket connection and register it.

        Args:
            client_id: Unique identifier for this browser tab/session.
            websocket: The FastAPI WebSocket object.
        """
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"WebSocket connected: {client_id}")

    def disconnect(self, client_id: str) -> None:
        """
        Remove a client from active connections.

        Args:
            client_id: The client to disconnect.
        """
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"WebSocket disconnected: {client_id}")

    async def send_event(self, client_id: str, event_type: str, data: dict = None) -> None:
        """
        Send a typed event to a specific connected client.

        Args:
            client_id: Which browser tab to send to.
            event_type: Event name like 'planner_thinking', 'task_complete'.
            data: Optional payload dict to include with the event.
        """
        if client_id not in self.active_connections:
            logger.warning(f"Cannot send event — client {client_id} not connected")
            return

        message = {
            "type": event_type,
            "data": data or {}
        }

        try:
            await self.active_connections[client_id].send_text(json.dumps(message))
        except Exception as e:
            logger.error(f"Failed to send WebSocket event to {client_id}: {e}")
            self.disconnect(client_id)

    async def broadcast(self, event_type: str, data: dict = None) -> None:
        """
        Send an event to ALL connected clients.

        Args:
            event_type: Event name.
            data: Optional payload dict.
        """
        disconnected = []
        for client_id in self.active_connections:
            try:
                await self.send_event(client_id, event_type, data)
            except Exception:
                disconnected.append(client_id)

        # Clean up any broken connections
        for client_id in disconnected:
            self.disconnect(client_id)


# Single global instance — imported wherever needed
ws_manager = WebSocketManager()