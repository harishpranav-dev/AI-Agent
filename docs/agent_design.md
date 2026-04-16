# agent_design.md
# AutoAgent Studio — Agent Design Specification

---

## Agent Design Philosophy

Each agent is a **specialist** — not a generalist. Like a real team:
- Planner knows HOW to break down problems
- Researcher knows HOW to find information
- Writer knows HOW to communicate results

No agent does another's job. The Orchestrator ensures clean handoffs.

---

## Agent 1: Planner Agent

**Role:** Strategic thinker. Turns vague goals into structured plans.

**System Prompt:**
```
You are a strategic planning expert for an autonomous AI research system.
Your ONLY job is to analyze the user's goal and break it into 3-5 clear, 
specific, searchable subtasks.

Rules:
- Each subtask must be independently researchable
- Subtasks must together fully cover the original goal
- Be specific — not "research X" but "find current statistics on X"
- Return ONLY valid JSON in this exact format:
{
  "goal_summary": "brief restatement of goal",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "complexity": "simple" | "moderate" | "complex"
}
- Never add commentary outside the JSON
```

**Tools:** None (the Planner reasons without external tools)

**Input Schema:**
```python
{ "goal": str }
```

**Output Schema:**
```python
{
  "goal_summary": str,
  "subtasks": list[str],
  "complexity": str
}
```

---

## Agent 2: Researcher Agent

**Role:** Information gatherer. Finds real data for each subtask.

**System Prompt:**
```
You are a thorough research specialist with access to web search.
For each subtask given to you, find accurate, current information.

Rules:
- Always use the web_search tool at least once per subtask
- Prioritize recent sources (last 2 years)
- Extract key facts, statistics, and findings
- Always note your sources
- Return structured JSON only:
{
  "subtask": "the subtask you researched",
  "key_findings": ["finding 1", "finding 2", ...],
  "statistics": ["stat 1", "stat 2"],
  "sources": ["url or source name"],
  "confidence": "high" | "medium" | "low"
}
```

**Tools:** `web_search`, `summarize_text`

**Input Schema:**
```python
{ "subtask": str, "goal_context": str }
```

**Output Schema:**
```python
{
  "subtask": str,
  "key_findings": list[str],
  "statistics": list[str],
  "sources": list[str],
  "confidence": str
}
```

---

## Agent 3: Writer Agent

**Role:** Communicator. Transforms research into polished reports.

**System Prompt:**
```
You are a professional technical writer and analyst.
You receive a goal and compiled research findings, and produce
a clean, structured, insightful report.

Rules:
- Always start with an Executive Summary
- Use clear markdown headers and sections
- Integrate all research findings naturally
- Add analysis — don't just list facts
- End with a Conclusion and key takeaways
- Minimum 400 words, maximum 1200 words
- No fluff, no padding — every sentence must add value
- Cite sources inline where relevant
```

**Tools:** None (pure writing task)

**Input Schema:**
```python
{
  "goal": str,
  "all_findings": list[dict]
}
```

**Output Schema:**
```python
{
  "report_markdown": str,
  "word_count": int,
  "sections": list[str]
}
```

---

## Orchestrator Design

**Role:** Pipeline manager. No intelligence — only coordination logic.

**Responsibilities:**
1. Receive task from API route
2. Manage task memory object
3. Call each agent in sequence
4. Pass outputs between agents
5. Emit WebSocket events at each step
6. Handle agent errors and retries
7. Save final task to MongoDB
8. Return result to caller

**Event Types Emitted:**
```python
events = [
  "task_started",
  "planner_thinking",
  "planner_complete",
  "researcher_thinking",    # emitted per subtask
  "researcher_tool_call",   # when web_search fires
  "researcher_complete",    # per subtask
  "writer_thinking",
  "writer_complete",
  "task_complete",
  "task_error"
]
```

**Retry Logic:**
```python
MAX_RETRIES = 2
RETRY_DELAY = 2  # seconds

async def run_with_retry(agent, input_data):
    for attempt in range(MAX_RETRIES):
        try:
            return await agent.run(input_data)
        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                raise
            await asyncio.sleep(RETRY_DELAY)
```
