# project_details.md
# AutoAgent Studio — Full Project Details

---

## Full Feature Breakdown

### Core Features (College Requirements)
1. **Single-Agent Task Completion** — One agent takes a goal, reasons through it, uses tools, returns result
2. **Single-step vs Multi-step Comparison** — Side-by-side visual showing the difference
3. **Multi-Agent System** — Three agents with defined roles collaborating in sequence
4. **LangChain + Claude API Integration** — Industry-standard tools used in production

### Extra Features (Stand-Out Factor)
5. **Live Thinking Visualizer** — Stream each agent's internal reasoning to the UI in real time
6. **Web Search Tool** — Researcher agent calls real search API (Tavily or SerpAPI)
7. **Task History Dashboard** — MongoDB-backed log of all completed agent runs
8. **Agent Performance Stats** — Time taken, tools called, steps completed per run
9. **PDF Export** — Download formatted agent output
10. **Agent Role Customization** — Change system prompts per agent via UI
11. **Dark/Light Mode** — UI theme toggle
12. **Mobile Responsive** — Tailwind responsive design
13. **User Sessions** — Each browser session tracks its own history

---

## Functional Requirements

| ID | Requirement |
|---|---|
| FR01 | User can type a goal and submit it to the agent system |
| FR02 | System must show which agent is active and what it is doing |
| FR03 | Planner agent must produce a structured list of subtasks |
| FR04 | Researcher agent must use web search tool for real data |
| FR05 | Writer agent must produce clean, formatted output |
| FR06 | Orchestrator must pass outputs between agents correctly |
| FR07 | All agent reasoning must stream to frontend in real time |
| FR08 | Completed tasks must save to MongoDB |
| FR09 | User can view all past tasks in history dashboard |
| FR010 | User can export any task result as PDF |
| FR011 | Single-agent mode must be independently selectable |
| FR012 | System must handle errors gracefully and show error state |

---

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NF01 | Agent response time under 30 seconds for standard tasks |
| NF02 | UI must feel responsive — no freezing during agent execution |
| NF03 | System must work on Chrome, Firefox, Safari |
| NF04 | Application must be deployable with a single command |
| NF05 | All secrets stored in environment variables |
| NF06 | Code must be documented and readable by a beginner |
| NF07 | Mobile viewport must be fully usable |

---

## User Workflow

```
1. User opens AutoAgent Studio in browser
2. User selects mode: Single Agent or Multi Agent
3. User types a goal (e.g. "Research climate change solutions")
4. User clicks "Run Agents"
5. UI shows:
   - Agent pipeline activating one by one
   - Live log of each agent's actions
   - Progress bars per agent
   - Timer and stats updating
6. When complete:
   - Final result appears in output panel
   - User can read, copy, or export as PDF
   - Task is saved to history automatically
7. User can visit History tab to see all past runs
```

---

## Agent Workflow

```
ORCHESTRATOR receives goal
        ↓
PLANNER AGENT
  - Input: raw user goal
  - Process: breaks into 3-5 subtasks
  - Output: structured JSON plan
        ↓
RESEARCHER AGENT (runs for each subtask)
  - Input: subtask from planner
  - Process: calls web_search tool, gathers data
  - Output: research findings per subtask
        ↓
WRITER AGENT
  - Input: all research findings + original goal
  - Process: writes structured, formatted report
  - Output: final markdown report
        ↓
ORCHESTRATOR returns result to frontend
```

---

## Tools Used

| Tool | Agent | Purpose |
|---|---|---|
| `web_search` | Researcher | Search internet for real-time information |
| `summarize_text` | Researcher | Condense long search results |
| `format_report` | Writer | Structure output into sections |

---

## External APIs

| API | Purpose | Cost |
|---|---|---|
| Anthropic Claude API | LLM for all agents | Pay-per-token |
| Tavily Search API | Real web search for researcher | Free tier available |
| MongoDB Atlas | Database for task history | Free tier (512MB) |

---

## Expected Outputs Per Agent

**Planner Output (JSON):**
```json
{
  "goal": "Research climate change solutions",
  "subtasks": [
    "Find latest scientific data on climate change causes",
    "Research top 5 current solutions being implemented",
    "Find statistics on effectiveness of solutions",
    "Identify future projections"
  ],
  "estimated_steps": 4
}
```

**Researcher Output (JSON):**
```json
{
  "subtask": "Find latest scientific data",
  "sources_found": 8,
  "key_findings": ["CO2 levels at record high...", "Arctic ice melting 3x faster..."],
  "raw_data": "..."
}
```

**Writer Output (Markdown):**
```markdown
# Climate Change Solutions — Research Report

## Executive Summary
...

## Key Findings
...

## Solutions Analysis
...

## Conclusion
...
```

---

## Edge Cases

| Case | Handling |
|---|---|
| User submits empty goal | Frontend validation — show error before API call |
| Claude API timeout | Retry once, then show graceful error message |
| Web search returns no results | Agent uses its trained knowledge instead, notes limitation |
| Agent produces malformed JSON | Orchestrator validates and requests retry |
| User loses connection mid-run | Show reconnection status, allow re-fetch of result |
| MongoDB unavailable | Task still completes, history save fails silently with warning |

---

## Limitations

- Agents share the same Claude API key — concurrent users share rate limits
- Web search limited to Tavily free tier (1000 searches/month)
- No real authentication — sessions are browser-local only
- Agent context window limited to Claude's max tokens
- No streaming between agents — each agent completes before next starts (v1)

---

## Future Improvements (v2+)

- Streaming agent-to-agent communication
- User authentication with saved history per account
- Custom tool builder — users define their own agent tools
- Agent performance analytics dashboard
- Support for file uploads (PDF, CSV) as agent input
- Agent chaining configurator — drag-and-drop pipeline builder
- Multi-language support
