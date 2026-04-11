"""
module: main.py
purpose: FastAPI application entry point for AutoAgent Studio.
         
         PHASE 9 ADDITIONS:
         1. Structured logging configuration (Step 3)
         2. Request logging middleware — logs every API call with timing (Step 2)
         3. Global exception handler — catches unhandled errors (Step 1)
         4. API info/summary endpoint (Step 4)
         
author: HP & Mushan
"""

import os
import time
import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from db.mongo import connect_to_mongo, close_mongo_connection
from routes.agent_routes import router as agent_router
from routes.history_routes import router as history_router
from streaming.websocket_manager import ws_manager

# ── PHASE 9 STEP 3: LOGGING CONFIGURATION ─────────────────────
# This sets up Python's logging system so every module can log
# with a consistent format. Think of it like giving every part
# of your app a shared notebook to write status updates in.
#
# Format: "14:32:05 | INFO | agents.planner | Plan created..."
# This makes debugging way easier than random print() calls.

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()


# ── APP LIFESPAN (startup/shutdown) ────────────────────────────
# asynccontextmanager lets us run code when the app starts and stops.
# We connect to MongoDB on startup and disconnect on shutdown.

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events."""
    logger.info("AutoAgent Studio starting up...")
    await connect_to_mongo()
    logger.info("Startup complete")
    yield
    logger.info("Shutting down...")
    await close_mongo_connection()
    logger.info("Shutdown complete")


# ── CREATE THE APP ─────────────────────────────────────────────

app = FastAPI(
    title="AutoAgent Studio API",
    description="Multi-agent AI system with Planner, Researcher, and Writer agents",
    version="1.0.0",
    lifespan=lifespan
)


# ── CORS MIDDLEWARE ────────────────────────────────────────────
# CORS (Cross-Origin Resource Sharing) controls which websites
# can call your API. Your React frontend runs on a different port
# than FastAPI, so without this, the browser would block requests.

cors_origin = os.getenv("CORS_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[cors_origin, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── PHASE 9 STEP 2: REQUEST LOGGING MIDDLEWARE ─────────────────
# Middleware is code that runs on EVERY request, before and after
# your route handler. This one logs the method, path, status code,
# and how long the request took — like a security camera at the door.
#
# Example log: "POST /api/run — 200 (1.234s)"
# This helps you spot slow endpoints and failed requests.

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every HTTP request with timing information."""
    start = time.time()
    response = await call_next(request)
    duration = round(time.time() - start, 3)
    logger.info(
        f"{request.method} {request.url.path} — {response.status_code} ({duration}s)"
    )
    return response


# ── PHASE 9 STEP 1: GLOBAL EXCEPTION HANDLER ──────────────────
# This is a safety net for unhandled exceptions. If something
# crashes anywhere in your app and isn't caught by a try/except,
# this handler catches it and returns a clean JSON error instead
# of an ugly HTML 500 page.
#
# Think of it like an airbag — you hope it never fires, but when
# it does, it prevents the worst outcome (exposing stack traces
# to users or crashing silently).

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch any unhandled exception and return a clean JSON error."""
    logger.critical(
        f"Unhandled exception on {request.method} {request.url.path}: {exc}",
        exc_info=True
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc)
        }
    )


# ── REGISTER ROUTE MODULES ────────────────────────────────────
# Include the route files we created — this connects all the
# endpoints to the app.

app.include_router(agent_router)
app.include_router(history_router)


# ── BASIC ENDPOINTS ───────────────────────────────────────────

@app.get("/")
async def root():
    """Root endpoint — confirms the API is running."""
    return {
        "message": "AutoAgent Studio API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint — reports whether API keys
    and database are configured. Useful for deployment checks.
    """
    return {
        "status": "healthy",
        "anthropic_key_set": bool(os.getenv("ANTHROPIC_API_KEY")),
        "tavily_key_set": bool(os.getenv("TAVILY_API_KEY")),
        "mongodb_url_set": bool(os.getenv("MONGODB_URL"))
    }


# ── PHASE 9 STEP 4: API INFO ENDPOINT ─────────────────────────
# This endpoint returns a summary of everything your API can do.
# It's useful for documentation and for the frontend to know
# what endpoints are available. Like a restaurant menu.

@app.get("/api/info")
async def api_info():
    """Returns API capabilities summary — all endpoints, agents, and tools."""
    return {
        "name": "AutoAgent Studio API",
        "version": "1.0.0",
        "agents": ["Planner", "Researcher", "Writer"],
        "modes": {
            "single": "Planner + Writer only (uses LLM knowledge, no web search)",
            "multi": "Planner + Researcher + Writer (uses real web search)"
        },
        "endpoints": {
            "run": "POST /api/run — Run full agent pipeline",
            "planner": "POST /api/planner — Run Planner agent only",
            "researcher": "POST /api/researcher — Run Researcher agent only",
            "writer": "POST /api/writer — Run Writer agent only",
            "history": "GET /api/history/{session_id} — Get task history",
            "task": "GET /api/history/task/{task_id} — Get single task",
            "info": "GET /api/info — This endpoint",
            "health": "GET /health — Health check",
            "websocket": "WS /ws/{client_id} — Real-time events"
        },
        "tools": ["web_search", "summarize_text"],
        "database": "MongoDB Atlas"
    }


# ── WEBSOCKET ENDPOINT ────────────────────────────────────────
# This is from Phase 8. The browser connects here to receive
# real-time progress events as agents work.

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time agent progress events.
    
    The browser opens a WebSocket connection when the user starts
    a task. The orchestrator then pushes events like 'planner_thinking'
    and 'researcher_tool_call' through this connection.

    Args:
        websocket: The WebSocket connection object.
        client_id: Unique identifier for this browser tab.
    """
    await ws_manager.connect(client_id, websocket)
    try:
        # Keep the connection open — listen for client messages
        while True:
            data = await websocket.receive_text()
            logger.debug(f"WebSocket message from {client_id}: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(client_id)
        logger.info(f"WebSocket client {client_id} disconnected")
    except Exception as e:
        ws_manager.disconnect(client_id)
        logger.error(f"WebSocket error for {client_id}: {e}")
