# AutoAgent Studio

🚀 **Live Demo:** https://ai-agent-tau-gilt.vercel.app/
📡 **API:** https://ai-agent-production-178e.up.railway.app/docs

Multi-agent AI research system with Planner, Researcher, and Writer agents.
Built with FastAPI, React, Claude API, Tavily, and MongoDB Atlas.

## What It Does

AutoAgent Studio is a full-stack web application that demonstrates how
**multi-agent AI systems** work in practice. A user submits a research goal,
and three specialized AI agents — **Planner**, **Researcher**, and **Writer** —
collaborate autonomously to produce a structured report.

Every step of every agent's reasoning is streamed to the UI in real time via
WebSockets, so users can _watch_ the agents think, call tools, and hand off
work to each other.

---

## Why It Matters

Most AI tools today are passive — they answer one question at a time. Real
autonomous systems have to plan, research, synthesize, and deliver structured
output without human intervention at every step. AutoAgent Studio is both a
**working research tool** and a **teaching artifact** that makes multi-agent
AI visible, understandable, and useful.

---

## Features

| Feature                      | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| **Multi-Agent Pipeline**     | Planner → Researcher → Writer, coordinated by an orchestrator |
| **Single-Agent Mode**        | One-shot agent for comparison with the multi-agent flow       |
| **Live Thinking Visualizer** | Real-time WebSocket stream of every agent event               |
| **Real Web Search**          | Researcher uses the Tavily API for live internet data         |
| **Task History**             | All runs persisted to MongoDB Atlas, browsable from the UI    |
| **PDF Export**               | Download any completed report as a formatted PDF              |
| **Performance Stats**        | Time taken, tools called, steps completed per run             |
| **Neon Noir Theme**          | Custom dark-mode UI built with Tailwind CSS                   |
| **Mobile Responsive**        | Fully usable on phones and tablets                            |

---

## Tech Stack

| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| Backend language   | Python 3.11+                    |
| Backend framework  | FastAPI                         |
| LLM                | Anthropic Claude API            |
| Search             | Tavily Search API               |
| Database           | MongoDB Atlas (async via Motor) |
| Frontend framework | React 18                        |
| Build tool         | Vite                            |
| Styling            | Tailwind CSS                    |
| Real-time          | WebSockets (FastAPI native)     |
| Testing            | Pytest (71 tests, 100% passing) |
| Backend hosting    | Railway                         |
| Frontend hosting   | Vercel                          |
| Version control    | Git + GitHub                    |

---

## Architecture at a Glance

```
┌────────────────────────────────────────────────────────┐
│  Frontend (React + Tailwind)                           │
│  Home · Single Agent · Multi Agent · History           │
└──────────────────┬─────────────────────────────────────┘
                   │  HTTP REST + WebSocket
┌──────────────────▼─────────────────────────────────────┐
│  Backend (FastAPI)                                     │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Agent Orchestrator                       │  │
│  │  Planner ──► Researcher ──► Writer               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Tool Manager · Memory Store · WebSocket Manager       │
└──────┬──────────────────┬───────────────────┬──────────┘
       │                  │                   │
  Claude API          Tavily API          MongoDB Atlas
```

Full architecture details are in [`docs/architecture.md`](docs/architecture.md).

---

## Setup — Local Development

### Prerequisites

- Python 3.11 or newer
- Node.js 18 or newer
- A free MongoDB Atlas cluster
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- A Tavily API key ([tavily.com](https://tavily.com))

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # then fill in your keys
uvicorn main:app --reload --port 8000
```

Backend will be live at `http://localhost:8000`. Interactive API docs are at
`http://localhost:8000/docs`.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # then set API URL if different
npm run dev
```

Frontend will be live at `http://localhost:5173`.

---

## Environment Variables

### `backend/.env`

```env
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/autoagent
CORS_ORIGIN=http://localhost:5173
PORT=8000
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

> **Never commit `.env` files.** They are listed in `.gitignore`. Use the
> `.env.example` files as templates.

---

## Running Tests

From `backend/`:

```bash
pytest                    # run all 71 tests
pytest -v                 # verbose
pytest tests/test_planner.py  # single file
```

All tests must pass before deployment.

---

## Project Structure

```
autoagent-studio/
├── backend/              FastAPI server, agents, tools, routes
│   ├── agents/           Planner, Researcher, Writer, Orchestrator
│   ├── tools/            web_search, summarize, format_report
│   ├── routes/           API and WebSocket endpoints
│   ├── db/               MongoDB connection + task schema
│   ├── streaming/        WebSocket event manager
│   └── tests/            Pytest suite (71 tests)
├── frontend/             React + Vite + Tailwind UI
│   └── src/
│       ├── pages/        Home, SingleAgent, MultiAgent, History
│       ├── components/   AgentCard, LiveLog, TaskResult, StatBar
│       └── hooks/        useAgent, useWebSocket
├── docs/                 Project documentation
└── README.md             You are here
```

Every folder has its own `README.md` explaining what lives there.

---

## Deployment

- **Backend** deploys to [Railway](https://railway.app) from the `/backend` folder
- **Frontend** deploys to [Vercel](https://vercel.com) from the `/frontend` folder
- **Database** is a free-tier [MongoDB Atlas](https://cloud.mongodb.com) M0 cluster

Full deployment steps are in [`docs/deployment_plan.md`](docs/deployment_plan.md).

---

## Documentation

| File                                                   | Purpose                                             |
| ------------------------------------------------------ | --------------------------------------------------- |
| [`docs/project_overview.md`](docs/project_overview.md) | High-level goals, target users, learning objectives |
| [`docs/project_details.md`](docs/project_details.md)   | Feature breakdown, requirements, edge cases         |
| [`docs/architecture.md`](docs/architecture.md)         | System diagrams, folder structure, data flow        |
| [`docs/agent_design.md`](docs/agent_design.md)         | System prompts and schemas for every agent          |
| [`docs/deployment_plan.md`](docs/deployment_plan.md)   | Step-by-step deployment guide                       |

---

## Team

** Harishpranav R** — Full stack development, agent design, deployment

---

## College

**[Dr G R Damodaran college of science]** — AI Agents & Autonomous Systems Project

---

## License

This project is submitted for academic evaluation. Please contact the team
before reuse.
