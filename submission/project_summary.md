# GENERAL-AGENT — Project Summary

**A multi-agent AI research system built as a full-stack web application.**

---

## What it does

A user submits a research goal. Three specialized AI agents — Planner, Researcher, and
Writer — autonomously collaborate to complete it. The Planner breaks the goal into
subtasks. The Researcher searches the live web for real information using the Tavily
API. The Writer composes a structured markdown report. The entire pipeline runs in under
30 seconds, streams live updates to the UI over WebSocket, saves every run to MongoDB,
and lets the user export the final report as a PDF.

---

## Why it matters

Most AI tools are reactive — you ask a question, you get an answer. AutoAgent Studio
demonstrates the next shift: **autonomous AI systems** that plan their own steps, use
real tools, and execute multi-stage workflows end-to-end. It is both a working utility
and a teaching artifact — users can literally watch the agents think.

---

## Architecture at a glance

- **Frontend:** React + Vite + Tailwind CSS, deployed on Vercel
- **Backend:** FastAPI (Python 3.11, async), deployed on Railway
- **LLM:** Anthropic Claude API (Claude Sonnet 4)
- **Web Search:** Tavily API
- **Database:** MongoDB Atlas (task history persistence)
- **Real-time updates:** FastAPI WebSockets

Each agent is a subclass of a shared `BaseAgent` class with its own system prompt, tool
set, and input/output schema. An Orchestrator coordinates them — passing outputs
between agents, emitting live events, and handling retries. This separation of
concerns means new agents can be added without modifying existing ones.

---

## Key features delivered

| Feature                                          | Status     |
| ------------------------------------------------ | ---------- |
| Single-agent mode                                | ✅ Working |
| Multi-agent mode (Planner → Researcher → Writer) | ✅ Working |
| Live streaming of agent reasoning via WebSocket  | ✅ Working |
| Real web search via Tavily API                   | ✅ Working |
| Task history dashboard (MongoDB-backed)          | ✅ Working |
| PDF export of final reports                      | ✅ Working |
| Mobile responsive UI                             | ✅ Working |
| Production deployment (public URL)               | ✅ Live    |

---

## Learning outcomes achieved

1. Understood the distinction between chatbots and autonomous agents
2. Built single-step and multi-step agents using the Claude API
3. Implemented tool use / function calling with real external APIs
4. Designed and built a multi-agent system with coordinated roles
5. Built an agent orchestrator with retry logic and event streaming
6. Integrated short-term task memory and long-term MongoDB persistence
7. Connected agents to real-world tools (web search)
8. Built a full-stack web application (React + FastAPI + MongoDB)
9. Deployed a production-ready application to Railway and Vercel
10. Practiced clean software engineering — tests, documentation, version control

---

## Tech stack summary

```
Frontend    React 18 + Vite + Tailwind CSS 3
Backend     FastAPI + Python 3.11 + async/await
LLM         Anthropic Claude API
Search      Tavily API
Database    MongoDB Atlas + Motor (async driver)
Realtime    WebSockets (FastAPI native)
Testing     Pytest (71 unit tests + 11 integration tests)
Deployment  Railway (backend) + Vercel (frontend)
VCS         Git + GitHub
```

---

## How to evaluate in 60 seconds

1. Open the live URL (see `live_url.txt`)
2. Go to **Multi-Agent Studio**
3. Enter a goal, e.g. _"Research the latest breakthroughs in quantum computing"_
4. Click **Run Agents**
5. Watch the three agents collaborate in real time
6. Export the final report as PDF

---

## One-line pitch

**Most student AI projects show what AI can say. Ours shows what AI can do.**
