"""
module: main.py
purpose: FastAPI application entry point for AutoAgent Studio backend.
author: HP & Mushan
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routes.agent_routes import router as agent_router

load_dotenv()

app = FastAPI(
    title="AutoAgent Studio API",
    description="Backend for AI Agents & Autonomous Systems",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)


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