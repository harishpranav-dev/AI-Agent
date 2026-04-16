"""
package: streaming
purpose: Exposes the WebSocket connection manager used to push real-time
         agent progress events to connected browser clients.
author: HP & Mushan
"""

from streaming.websocket_manager import WebSocketManager, ws_manager

__all__ = [
    "WebSocketManager",
    "ws_manager",
]
