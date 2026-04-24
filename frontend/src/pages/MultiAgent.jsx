/**
 * module: MultiAgent.jsx
 * purpose: Multi-Agent Studio page — the hero page.
 *          Goal input, customization, War Room pipeline, report.
 * author: HP & Mushan
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAgent } from "../hooks/useAgent";
import TypingPlaceholder from "../components/TypingPlaceholder";
import WarRoom from "../components/WarRoom";
import LiveLog from "../components/LiveLog";
import TaskResult from "../components/TaskResult";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const MULTI_SUGGESTIONS = [
  "Research the latest developments in quantum computing...",
  "Analyze the global impact of AI on employment...",
  "Investigate renewable energy trends for 2025...",
  "Compare different approaches to cancer treatment...",
  "Study the evolution of space exploration technology...",
];

export default function MultiAgent() {
  const [goal, setGoal] = useState("");
  const [customPrompts, setCustomPrompts] = useState({
    planner: "",
    researcher: "",
    writer: "",
  });
  const [errorCount, setErrorCount] = useState(0);

  const { status, agentStates, logs, result, stats, elapsed, run, reset } =
    useAgent();

  const isRunning = status === "running";
  const isComplete = status === "complete";
  const isError = status === "error";
  const canRun = goal.trim().length > 0 && !isRunning;

  const handleRun = () => {
    if (!canRun) return;
    run(goal, "multi", customPrompts);
  };
  const handleReset = () => {
    reset();
    setGoal("");
  };
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canRun) handleRun();
  };

  // Track error count for progressive messages
  React.useEffect(() => {
    if (isError) setErrorCount((c) => c + 1);
  }, [isError]);

  // Find task_id from logs for export/history link
  const taskId = logs.find(
    (l) => l.type === "system" && l.message.includes("Task started"),
  )
    ? null // We don't have task_id directly; history link is simpler
    : null;

  return (
    <div style={{ paddingBottom: "48px" }}>
      {/* Header */}
      <div className="rise" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "3px",
              background: "var(--grad-primary)",
              boxShadow: "0 0 10px rgba(220,38,38,0.3)",
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Multi-Agent Pipeline
          </span>
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 800,
            color: "var(--text-0)",
            letterSpacing: "-0.03em",
            marginBottom: "6px",
          }}
        >
          Multi-Agent Studio
        </h1>
        <p
          style={{
            color: "var(--text-3)",
            fontSize: "clamp(13px, 2vw, 14px)",
            lineHeight: 1.5,
            maxWidth: "520px",
          }}
        >
          Enter a goal and watch three AI agents — Planner, Researcher, and
          Writer — collaborate to complete it.
        </p>
      </div>

      {/* ── Section 1: Goal Input ── */}
      <div
        className="rise-d1 glass-card-heavy glass-shine"
        style={{
          padding: "20px",
          marginBottom: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <label
          className="font-mono"
          style={{
            color: "var(--text-3)",
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
            display: "block",
          }}
        >
          Your Goal
        </label>

        <TypingPlaceholder
          suggestions={MULTI_SUGGESTIONS}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          rows={3}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "14px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {!isComplete && !isError && (
            <button
              onClick={handleRun}
              disabled={!canRun}
              className={canRun ? "btn-press btn-neon" : ""}
              style={{
                padding: "10px 24px",
                borderRadius: "var(--r-sm)",
                fontSize: "13px",
                fontWeight: 700,
                color: canRun ? "#fff" : "var(--text-3)",
                background: canRun ? "var(--grad-primary)" : "var(--bg-muted)",
                border: "none",
                boxShadow: canRun ? "0 2px 20px rgba(220,38,38,0.3)" : "none",
                cursor: canRun ? "pointer" : "not-allowed",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isRunning ? (
                <>
                  <span className="typing-dots" style={{ color: "#fff" }}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  Agents Working...
                </>
              ) : (
                "Run Agents →"
              )}
            </button>
          )}
          {(isComplete || isError) && (
            <button
              onClick={handleReset}
              className="btn-press btn-glass"
              style={{
                padding: "10px 24px",
                borderRadius: "var(--r-sm)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ↻ New Task
            </button>
          )}
          {!isRunning && goal.trim().length > 0 && (
            <span
              className="font-mono"
              style={{
                color: "var(--text-4)",
                fontSize: "10px",
                padding: "3px 8px",
                borderRadius: "var(--r-sm)",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-0)",
              }}
            >
              ⌘ + Enter
            </span>
          )}
        </div>
      </div>

      {/* ── Section 2: Customize Agent Prompts ── */}
      <div className="rise-d1" style={{ marginBottom: "20px" }}>
        <details className="glass-card-heavy" style={{ padding: "14px 20px" }}>
          <summary
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-1)",
              cursor: "pointer",
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚙️</span>
              <span>Customize Agent Prompts</span>
            </div>
            <span
              className="font-mono"
              style={{
                color: "var(--text-4)",
                fontSize: "9px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "2px 8px",
                borderRadius: "var(--r-full)",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-0)",
              }}
            >
              Advanced
            </span>
          </summary>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-3)",
              marginTop: "12px",
              marginBottom: "16px",
              lineHeight: 1.5,
            }}
          >
            Override agent system prompts below. Leave empty to use defaults.
          </p>

          {[
            { key: "planner", label: "Planner Agent", color: "#dc2626" },
            { key: "researcher", label: "Researcher Agent", color: "#f59e0b" },
            { key: "writer", label: "Writer Agent", color: "#ef4444" },
          ].map((agent) => (
            <div
              key={agent.key}
              style={{ marginBottom: agent.key === "writer" ? 0 : "14px" }}
            >
              <p
                className="font-mono"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: agent.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "2px",
                    background: agent.color,
                  }}
                />
                {agent.label}
              </p>
              <textarea
                value={customPrompts[agent.key]}
                onChange={(e) =>
                  setCustomPrompts((p) => ({
                    ...p,
                    [agent.key]: e.target.value,
                  }))
                }
                placeholder="Leave empty to use default prompt..."
                disabled={isRunning}
                style={{
                  width: "100%",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "var(--r-sm)",
                  padding: "10px 14px",
                  color: "var(--text-1)",
                  fontSize: "12px",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  height: "64px",
                  boxSizing: "border-box",
                  opacity: isRunning ? 0.5 : 1,
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
          ))}
        </details>
      </div>

      {/* ── Section 3: THE WAR ROOM ── */}
      <div className="rise-d2" style={{ marginBottom: "20px" }}>
        <WarRoom
          agentStates={agentStates}
          logs={logs}
          stats={stats}
          elapsed={elapsed}
          status={status}
        />
      </div>

      {/* ── Live Log (below war room) ── */}
      {(isRunning || isComplete || isError) && (
        <div className="rise-d3" style={{ marginBottom: "20px" }}>
          <LiveLog logs={logs} />
        </div>
      )}

      {/* ── Section 4: Report (after completion) ── */}
      {isComplete && result && (
        <div className="rise-d3" style={{ marginBottom: "20px" }}>
          <TaskResult result={result} />

          {/* Action buttons below report */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              onClick={handleReset}
              className="btn-press btn-glass"
              style={{
                padding: "10px 24px",
                borderRadius: "var(--r-sm)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ↻ New Task
            </button>
            <Link
              to="/history"
              style={{
                fontSize: "13px",
                color: "var(--gold)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fbbf24";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gold)";
              }}
            >
              View in History →
            </Link>
          </div>
        </div>
      )}

      {/* ── Error Banner ── */}
      {isError && (
        <div
          className="rise"
          style={{
            marginTop: "16px",
            padding: "14px 18px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "var(--r-md)",
            color: "#ef4444",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span>
              {errorCount > 1
                ? "Something went wrong. Please try again after some time."
                : "Something went wrong. Please try again."}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="btn-press font-mono"
            style={{
              padding: "6px 16px",
              borderRadius: "var(--r-sm)",
              fontSize: "11px",
              fontWeight: 600,
              color: "#ef4444",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            New Task
          </button>
        </div>
      )}
    </div>
  );
}
