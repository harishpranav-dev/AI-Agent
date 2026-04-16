"""
package: routes
purpose: Exposes the FastAPI routers for all API endpoints.
         main.py imports these routers and mounts them on the app.
author: HP & Mushan
"""

from routes.agent_routes import router as agent_router
from routes.history_routes import router as history_router
from routes.export_routes import router as export_router

__all__ = [
    "agent_router",
    "history_router",
    "export_router",
]
