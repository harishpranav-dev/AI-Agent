# architecture.md
# AutoAgent Studio — System Architecture

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Tailwind)               │
│                                                                   │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Home /       │  │  MultiAgent       │  │  History          │   │
│  │  SingleAgent  │  │  Studio           │  │  Dashboard        │   │
│  └──────────────┘  └──────────────────┘  └──────────────────┘   │
│           │                  │                      │             │
│           └──────────────────┼──────────────────────┘             │
│                              │                                    │
│                    useAgent() hook                                │
│                    WebSocket client                               │
└──────────────────────────────┼────────────────────────────────────┘
                               │  HTTP REST + WebSocket
┌──────────────────────────────▼────────────────────────────────────┐
│                      BACKEND (FastAPI + Python)                    │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    Agent Orchestrator                        │  │
│  │                                                             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │   Planner   │  │  Researcher  │  │     Writer       │  │  │
│  │  │   Agent     │→ │   Agent      │→ │     Agent        │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │  Tool Manager │  │ Memory Store │  │   Stream Manager     │    │
│  │  web_search   │  │  (in-memory) │  │  (WebSocket events)  │    │
│  │  summarize    │  │              │  │                      │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
└──────────────────────────────┬────────────────────────────────────┘
                               │
          ┌────────────────────┼─────────────────────┐
          │                    │                      │
┌─────────▼────────┐  ┌────────▼───────┐  ┌──────────▼──────────┐
│  Claude API       │  │  Tavily Search  │  │  MongoDB Atlas       │
│  (Anthropic)      │  │  API            │  │  (Task History)      │
└──────────────────┘  └────────────────┘  └─────────────────────┘
```

---

## Agent Architecture

### Base Agent Pattern (all agents follow this)

```python
class BaseAgent:
    - system_prompt: str       # Agent's role and rules
    - tools: list              # Tools this agent can use
    - memory: dict             # Short-term context
    - model: str               # Claude model to use
    
    async def run(input: dict) -> dict:
        # 1. Build messages from input + memory
        # 2. Call Claude API with tools
        # 3. If tool_use → execute tool → continue loop
        # 4. Return structured output
```

### Planner Agent

```
Input:  { "goal": "user's raw goal string" }
Tools:  validate_plan
Output: { "subtasks": [...], "plan_id": "..." }
System: "You are a task planning expert. Break goals into 3-5 
         clear, actionable subtasks. Return JSON only."
```

### Researcher Agent

```
Input:  { "subtask": "...", "plan_context": {...} }
Tools:  web_search, summarize_text
Output: { "findings": [...], "sources": [...] }
System: "You are a research specialist. For each subtask,
         search for real, current information. Cite sources."
```

### Writer Agent

```
Input:  { "goal": "...", "all_findings": [...] }
Tools:  format_report
Output: { "report": "markdown string", "sections": [...] }
System: "You are a professional technical writer. Produce
         clean, structured markdown reports. No fluff."
```

### Orchestrator

```
Input:  { "goal": "...", "mode": "multi" | "single" }
Flow:
  1. Send goal to Planner → get plan
  2. For each subtask → send to Researcher → collect findings
  3. Send all findings to Writer → get final report
  4. Save to MongoDB
  5. Emit completion event via WebSocket
Output: { "report": "...", "metadata": { stats } }
```

---

## Multi-Agent Communication Flow

```
User Goal
    │
    ▼
Orchestrator.run(goal)
    │
    ├── emit_event("planner_start")
    │
    ▼
planner.run(goal)
    │   returns: plan = { subtasks: [...] }
    │
    ├── emit_event("planner_done", plan)
    │
    ▼
for subtask in plan.subtasks:
    │
    ├── emit_event("researcher_start", subtask)
    │
    ▼
    researcher.run(subtask)
    │   returns: findings = { data: [...] }
    │
    ├── emit_event("researcher_done", findings)
    │
    ▼
writer.run(goal + all_findings)
    │   returns: report = { markdown: "..." }
    │
    ├── emit_event("writer_done", report)
    │
    ▼
save_to_db(task_record)
    │
    ▼
emit_event("task_complete", report)
```

---

## Memory Handling

### Short-Term Memory (within a task)
- Stored as Python dict in memory during task execution
- Contains: original goal, plan, all research findings, agent outputs
- Passed between agents via orchestrator
- Cleared after task completes

```python
task_memory = {
    "task_id": "uuid",
    "goal": "original user goal",
    "plan": { planner output },
    "research": [ list of researcher outputs ],
    "report": None  # filled by writer
}
```

### Long-Term Memory (across tasks)
- Stored in MongoDB `tasks` collection
- Retrieved for history dashboard
- Not injected back into agents in v1

---

## Tool Usage Logic

```python
# Tool execution flow inside any agent
response = claude_api.call(messages, tools=agent_tools)

if response.stop_reason == "tool_use":
    tool_name = response.tool_use.name
    tool_input = response.tool_use.input
    
    tool_result = await tool_manager.execute(tool_name, tool_input)
    
    # Continue conversation with tool result
    messages.append({ "role": "tool_result", "content": tool_result })
    response = claude_api.call(messages, tools=agent_tools)

return response.text
```

---

## Folder Structure

```
autoagent-studio/
│
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env                       # API keys (never commit)
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py          # Base class all agents inherit
│   │   ├── planner_agent.py       # Planner implementation
│   │   ├── researcher_agent.py    # Researcher implementation
│   │   ├── writer_agent.py        # Writer implementation
│   │   └── orchestrator.py        # Manages all agents
│   │
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── tool_manager.py        # Routes tool calls to handlers
│   │   ├── web_search.py          # Tavily search tool
│   │   └── text_tools.py          # Summarize, format tools
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── agent_routes.py        # POST /run, GET /status
│   │   ├── history_routes.py      # GET /history, GET /task/:id
│   │   └── export_routes.py       # GET /api/export/pdf/:task_id
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── mongo.py               # MongoDB connection
│   │   └── models.py              # Task document schema
│   │
│   ├── streaming/
│   │   ├── __init__.py
│   │   └── websocket_manager.py   # WebSocket event emitter
│   │
│   └── tests/
│       ├── test_planner.py
│       ├── test_researcher.py
│       ├── test_writer.py
│       ├── test_orchestrator.py
│       └── test_tools.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── SingleAgent.jsx
│       │   ├── MultiAgent.jsx
│       │   └── History.jsx
│       │
│       ├── components/
│       │   ├── AgentCard.jsx
│       │   ├── LiveLog.jsx
│       │   ├── TaskResult.jsx
│       │   ├── StatBar.jsx
│       │   └── Navbar.jsx
│       │
│       └── hooks/
│           ├── useAgent.js
│           └── useWebSocket.js
│
├── docs/
│   ├── instructions.md
│   ├── project_overview.md
│   ├── project_details.md
│   ├── architecture.md
│   ├── api_design.md
│   ├── agent_design.md
│   └── deployment_plan.md
│
├── .gitignore
└── README.md
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Backend Language | Python | 3.11+ | Core application logic |
| Backend Framework | FastAPI | 0.110+ | REST API + WebSocket |
| AI Framework | LangChain | 0.2+ | Agent orchestration helpers |
| LLM API | Anthropic Claude | claude-sonnet-4 | Agent intelligence |
| Search API | Tavily | Latest | Web search tool |
| Database | MongoDB Atlas | 7.0 | Task history storage |
| ODM | Motor (async pymongo) | 3.x | Async MongoDB client |
| Frontend Framework | React | 18 | UI |
| Build Tool | Vite | 5 | Frontend bundler |
| CSS Framework | Tailwind CSS | 3 | Styling |
| HTTP Client | Axios | 1.x | Frontend API calls |
| WebSocket | FastAPI WebSocket | Built-in | Real-time updates |
| Testing | Pytest | 8.x | Backend tests |
| Deployment BE | Railway | - | Backend hosting |
| Deployment FE | Vercel | - | Frontend hosting |
| Version Control | Git + GitHub | - | Source control |

---

## Database Structure

### Collection: `tasks`

```json
{
  "_id": "ObjectId",
  "task_id": "uuid-string",
  "session_id": "browser-session-id",
  "mode": "multi" | "single",
  "goal": "user's original goal",
  "status": "running" | "complete" | "failed",
  "plan": {
    "subtasks": ["...", "..."],
    "created_at": "ISO timestamp"
  },
  "research": [
    {
      "subtask": "...",
      "findings": ["...", "..."],
      "sources": ["url1", "url2"],
      "tools_called": 2
    }
  ],
  "report": "# Final markdown report...",
  "metadata": {
    "total_time_seconds": 24,
    "tools_called": 6,
    "agents_used": ["planner", "researcher", "writer"],
    "steps_completed": 4
  },
  "created_at": "ISO timestamp",
  "completed_at": "ISO timestamp"
}
```

---

## Deployment Structure

```
GitHub Repository
      │
      ├── /backend  ──────────→  Railway
      │                          - Python FastAPI
      │                          - Environment variables set in Railway dashboard
      │                          - Auto-deploys on git push to main
      │
      └── /frontend ──────────→  Vercel
                                 - React + Vite
                                 - VITE_API_URL=https://your-railway-url.railway.app
                                 - Auto-deploys on git push to main
```

---

## Data Flow Explanation

1. User types goal in React frontend
2. React calls `POST /api/run` with `{ goal, mode, session_id }`
3. FastAPI receives request, creates task record in MongoDB with status "running"
4. FastAPI starts agent orchestrator in background task
5. Orchestrator emits WebSocket events as agents progress
6. React listens to WebSocket, updates UI in real time
7. When complete, orchestrator saves full result to MongoDB
8. FastAPI returns final result via WebSocket "task_complete" event
9. React displays result, allows PDF export
10. History dashboard fetches from `GET /api/history/:session_id`
