"""
module: main.py
purpose: FastAPI application entry point for AutoAgent Studio backend.
author: HP & Mushan
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from fastapi.responses import FileResponse

from streaming.websocket_manager import ws_manager
from routes.agent_routes import router as agent_router
from routes.history_routes import router as history_router
from db.mongo import connect_db, close_db

load_dotenv()

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage app startup and shutdown events.

    - On startup: connect to MongoDB
    - On shutdown: close the MongoDB connection

    This is FastAPI's modern way of handling lifecycle events.
    The 'yield' separates startup logic (before) from shutdown logic (after).
    """
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="AutoAgent Studio API",
    description="Backend for AI Agents & Autonomous Systems",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)
app.include_router(history_router)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time agent progress streaming.

    Clients connect to ws://localhost:8000/ws/{some-unique-id}
    and receive JSON events as agents work.
    The connection stays open until the client disconnects.
    """
    await ws_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"WS message from {client_id}: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(client_id)
        logger.info(f"Client {client_id} disconnected from WebSocket")


@app.get("/")
async def root():
    """Health check endpoint — confirms the server is running."""
    return {"status": "AutoAgent Studio is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    """Detailed health check — shows which environment variables are configured."""
    return {
        "status": "ok",
        "anthropic_key": "set" if os.getenv("ANTHROPIC_API_KEY") else "missing",
        "tavily_key": "set" if os.getenv("TAVILY_API_KEY") else "missing",
        "mongodb_url": "set" if os.getenv("MONGODB_URL") else "missing",
    }

@app.get("/ws-test")
async def ws_test_page():
    """Serve the WebSocket test page."""
    return FileResponse("tests/ws_test.html")