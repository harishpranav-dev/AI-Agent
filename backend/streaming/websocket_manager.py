"""
module: websocket_manager.py
purpose: Manages WebSocket connections for real-time agent progress streaming.
         Each connected client gets a unique client_id. When an agent pipeline
         runs, the orchestrator emits events (like "planner_thinking") and this
         manager delivers them to the right client.
author: HP & Mushan
"""

import json
import logging
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class WebSocketManager:
    """
    Manages active WebSocket connections.
    
    How it works:
    - When a client connects via ws://localhost:8000/ws/{client_id}, 
      we store their WebSocket object in a dictionary keyed by client_id.
    - When an agent emits an event, we look up the client_id and send
      the event as a JSON message through their WebSocket.
    - If the client disconnects, we remove them from the dictionary.
    """

    def __init__(self):
        """Initialize with an empty dictionary of connections."""
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str) -> None:
        """
        Accept and register a new WebSocket connection.
        
        Args:
            websocket: The FastAPI WebSocket object for this client
            client_id: A unique identifier for this client (sent from frontend)
        """
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"WebSocket connected: {client_id} | Total connections: {len(self.active_connections)}")

    def disconnect(self, client_id: str) -> None:
        """
        Remove a disconnected client from active connections.
        
        Args:
            client_id: The client to remove
        """
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"WebSocket disconnected: {client_id} | Total connections: {len(self.active_connections)}")

    async def send_event(self, client_id: str, event_type: str, data: dict) -> None:
        """
        Send a single event to a specific connected client.
        
        This is the main method the orchestrator calls. For example:
            await ws_manager.send_event("abc123", "planner_thinking", {"message": "Breaking down goal..."})
        
        The client receives a JSON message like:
            {"event": "planner_thinking", "data": {"message": "Breaking down goal..."}}
        
        Args:
            client_id: Which client to send to
            event_type: The type of event (e.g. "planner_thinking", "researcher_tool_call")
            data: A dictionary of event payload data
        """
        if client_id not in self.active_connections:
            logger.debug(f"Client {client_id} not connected, skipping event: {event_type}")
            return

        message = json.dumps({
            "event": event_type,
            "data": data
        })

        try:
            await self.active_connections[client_id].send_text(message)
            logger.debug(f"Sent event '{event_type}' to client {client_id}")
        except Exception as e:
            logger.warning(f"Failed to send event to {client_id}: {e}")
            self.disconnect(client_id)

    async def broadcast(self, event_type: str, data: dict) -> None:
        """
        Send an event to ALL connected clients.
        Useful for system-wide announcements.
        
        Args:
            event_type: The type of event
            data: Event payload
        """
        # Use list() to avoid "dictionary changed size during iteration" error
        for client_id in list(self.active_connections.keys()):
            await self.send_event(client_id, event_type, data)


# Global instance — imported by other modules
# This way every part of the app shares the same connection pool
ws_manager = WebSocketManager()