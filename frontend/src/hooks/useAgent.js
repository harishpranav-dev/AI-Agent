/**
 * module: useAgent.js
 * purpose: Custom React hook that manages the entire multi-agent run lifecycle.
 *          Connects WebSocket for real-time events, tracks each agent's state
 *          (waiting/thinking/done), collects live logs, and stores the final result.
 *
 *          KEY FIX: Uses shared getSessionId() so the client_id sent to the
 *          backend matches the session_id used by History.jsx to fetch tasks.
 *          Without this, tasks get saved under a random ID and History can't find them.
 *
 * author: HP & Mushan
 */

import { useState, useCallback, useRef } from "react";
import { runAgents } from "../api/client";
import { getSessionId } from "../utils/session";

/**
 * useAgent — central state manager for the Multi-Agent page.
 *
 * Returns:
 *   status       — 'idle' | 'running' | 'complete' | 'error'
 *   agentStates  — { planner, researcher, writer } each 'waiting' | 'thinking' | 'done'
 *   logs         — array of { type, message, color, time } log entries
 *   result       — final markdown report string (null until complete)
 *   stats        — { tools, steps, time } performance metrics
 *   elapsed      — live seconds counter while running
 *   run(goal, mode) — starts the agent pipeline
 *   reset()      — clears everything back to idle
 *   clientId     — unique browser client ID for WebSocket routing
 */
export function useAgent() {
  const [status, setStatus] = useState("idle");
  const [agentStates, setAgentStates] = useState({
    planner: "waiting",
    researcher: "waiting",
    writer: "waiting",
  });
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ tools: 0, steps: 0, time: 0 });

  // Use the shared session ID instead of a random client ID
  // This ensures the backend saves tasks with the SAME session_id
  // that History.jsx uses to fetch them back.
  const clientId = useRef(getSessionId());

  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  /** Appends a new entry to the live log array */
  const addLog = useCallback((type, message, color = "default") => {
    setLogs((prev) => [
      ...prev,
      {
        type,
        message,
        color,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  /**
   * run — kicks off the full agent pipeline.
   * 1. Opens a WebSocket to receive real-time events
   * 2. Sends the HTTP request to POST /api/run
   * 3. Updates state as WebSocket events arrive
   */
  const run = useCallback(
    async (goal, mode, customPrompts = {}) => {
      // Reset everything for a fresh run
      setStatus("running");
      setLogs([]);
      setResult(null);
      setElapsed(0);
      setStats({ tools: 0, steps: 0, time: 0 });
      setAgentStates({
        planner: "waiting",
        researcher: "waiting",
        writer: "waiting",
      });

      // Start a live elapsed-time counter (updates every second)
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Open WebSocket connection — backend sends events here as agents work
      const wsUrl = `${import.meta.env.VITE_WS_URL || "ws://localhost:8000"}/ws/${clientId.current}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onmessage = (event) => {
        const { event: eventType, data } = JSON.parse(event.data);

        switch (eventType) {
          case "task_started":
            addLog(
              "system",
              `Task started: "${data.goal?.substring(0, 50)}..."`,
              "accent",
            );
            break;

          case "planner_thinking":
            setAgentStates((s) => ({ ...s, planner: "thinking" }));
            addLog("planner", data.message, "planner");
            break;

          case "planner_complete":
            setAgentStates((s) => ({ ...s, planner: "done" }));
            addLog(
              "planner",
              `Plan ready — ${data.subtask_count} subtasks`,
              "planner",
            );
            break;

          case "researcher_thinking":
            setAgentStates((s) => ({ ...s, researcher: "thinking" }));
            addLog(
              "researcher",
              `Researching: "${data.subtask?.substring(0, 50)}"`,
              "researcher",
            );
            break;

          case "researcher_complete":
            addLog(
              "researcher",
              `Found ${data.findings_count} findings`,
              "researcher",
            );
            setStats((s) => ({ ...s, tools: s.tools + 1 }));
            break;

          case "writer_thinking":
            setAgentStates((s) => ({
              ...s,
              researcher: "done",
              writer: "thinking",
            }));
            addLog("writer", data.message, "writer");
            break;

          case "writer_complete":
          case "task_complete":
            setAgentStates((s) => ({ ...s, writer: "done" }));
            setStatus("complete");
            setResult(data.report);
            setStats({
              tools: data.stats?.tools_called || 0,
              steps: data.stats?.steps_completed || 0,
              time: data.duration_seconds || 0,
            });
            addLog("system", "Report complete!", "emerald");
            clearInterval(timerRef.current);
            break;

          case "task_error":
            setStatus("error");
            addLog("system", `Error: ${data.error}`, "rose");
            clearInterval(timerRef.current);
            break;
        }
      };

      // Handle WebSocket connection errors
      wsRef.current.onerror = () => {
        addLog("system", "WebSocket connection error", "rose");
      };

      // Now fire the HTTP request that triggers the backend pipeline
      try {
        await runAgents(goal, mode, clientId.current, customPrompts);
      } catch (err) {
        setStatus("error");
        addLog("system", `Failed: ${err.message}`, "rose");
        clearInterval(timerRef.current);
      }
    },
    [addLog],
  );

  /** reset — clears all state, closes WebSocket, stops timer */
  const reset = useCallback(() => {
    setStatus("idle");
    setLogs([]);
    setResult(null);
    setAgentStates({
      planner: "waiting",
      researcher: "waiting",
      writer: "waiting",
    });
    setStats({ tools: 0, steps: 0, time: 0 });
    setElapsed(0);
    clearInterval(timerRef.current);
    wsRef.current?.close();
  }, []);

  return {
    status,
    agentStates,
    logs,
    result,
    stats,
    elapsed,
    run,
    reset,
    clientId: clientId.current,
  };
}
