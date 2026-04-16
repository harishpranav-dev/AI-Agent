# backend/streaming/

Real-time event streaming over WebSockets. This is what powers the
"live thinking visualizer" in the frontend.

## Files

| File | Purpose |
|---|---|
| `websocket_manager.py` | Connection registry and event emitter. Tracks active WebSocket connections by `session_id` and broadcasts events to the right client. |

## Event types

The orchestrator emits these events during a task run:

| Event | When it fires |
|---|---|
| `task_started` | Orchestrator receives the goal |
| `planner_thinking` | Planner agent is calling Claude |
| `planner_complete` | Planner returned a plan |
| `researcher_thinking` | Researcher started a subtask |
| `researcher_tool_call` | Researcher fired `web_search` |
| `researcher_complete` | Subtask finished |
| `writer_thinking` | Writer started composing |
| `writer_complete` | Writer returned the report |
| `task_complete` | Full pipeline done |
| `task_error` | Any agent failed past retry |

## Event envelope

Every event shares the same JSON shape on the wire:

```json
{
  "event": "researcher_tool_call",
  "session_id": "abc-123",
  "task_id": "uuid",
  "timestamp": "ISO-8601",
  "payload": { ... }
}
```

The frontend's `useWebSocket` hook subscribes once per session and dispatches
events to the `LiveLog` and `AgentCard` components.

## Disconnection

If a client disconnects mid-task, the task still completes and is saved to
MongoDB. The user can refetch results from the history endpoint after
reconnecting.
