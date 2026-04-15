/**
 * module: MultiAgent.jsx
 * purpose: Main Multi-Agent Studio page.
 * author: HP & Mushan
 */

import React, { useState } from "react";
import { useAgent } from "../hooks/useAgent";
import AgentCard from "../components/AgentCard";
import LiveLog from "../components/LiveLog";
import StatBar from "../components/StatBar";
import TaskResult from "../components/TaskResult";

export default function MultiAgent() {
  const [goal, setGoal] = useState("");
  const [customPrompts, setCustomPrompts] = useState({
    planner: "",
    researcher: "",
    writer: "",
  });
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

  return (
    <>
      <style>{`
        .multi-layout { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .multi-layout { grid-template-columns: 1fr 1fr; gap: 24px; } }
      `}</style>

      <div style={{ paddingTop: "0", paddingBottom: "48px" }}>
        {/* Header */}
        <div className="rise" style={{ marginBottom: "28px" }}>
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
                background: "var(--grad-neon)",
                boxShadow: "0 0 10px rgba(0,212,255,0.3)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
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

        {/* Goal input */}
        <div
          className="rise-d1 glass-card-heavy glass-shine"
          style={{
            padding: "20px",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <label
            style={{
              color: "var(--text-2)",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Your Goal
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Research the latest developments in quantum computing and write a report..."
            disabled={isRunning}
            rows={3}
            style={{
              width: "100%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-2)",
              borderRadius: "var(--r-md)",
              padding: "12px 16px",
              color: "var(--text-0)",
              fontSize: "14px",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.6,
              opacity: isRunning ? 0.5 : 1,
              boxSizing: "border-box",
              transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            }}
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
                  color: canRun ? "#000" : "var(--text-3)",
                  background: canRun ? "var(--grad-neon)" : "var(--bg-muted)",
                  border: "none",
                  boxShadow: canRun ? "0 2px 20px rgba(0,212,255,0.3)" : "none",
                  cursor: canRun ? "pointer" : "not-allowed",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isRunning ? (
                  <>
                    <span className="typing-dots" style={{ color: "#000" }}>
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
                style={{
                  color: "var(--text-4)",
                  fontSize: "11px",
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

        {/* Customization */}
        <div className="rise-d1" style={{ marginBottom: "20px" }}>
          <details
            className="glass-card-heavy"
            style={{ padding: "16px 20px" }}
          >
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>⚙️</span>
                <span>Customize Agent Prompts</span>
              </div>
              <span
                style={{
                  color: "var(--text-4)",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
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
              { key: "planner", label: "Planner Agent", color: "#7B61FF" },
              {
                key: "researcher",
                label: "Researcher Agent",
                color: "#00ffaa",
              },
              { key: "writer", label: "Writer Agent", color: "#ffb800" },
            ].map((agent) => (
              <div
                key={agent.key}
                style={{ marginBottom: agent.key === "writer" ? 0 : "14px" }}
              >
                <p
                  style={{
                    fontSize: "11px",
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

        {/* 2-column layout */}
        <div className="multi-layout">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              className="rise-d2"
              style={{ display: "flex", flexDirection: "column", gap: "0" }}
            >
              <AgentCard role="planner" state={agentStates.planner} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "4px 0",
                }}
              >
                <div
                  className={`connector-line ${agentStates.planner === "done" ? "active" : ""}`}
                  style={{
                    background:
                      agentStates.planner === "done"
                        ? "linear-gradient(180deg, rgba(123,97,255,0.4), rgba(0,255,170,0.4))"
                        : "var(--border-1)",
                    color:
                      agentStates.planner === "done"
                        ? "#7B61FF"
                        : "transparent",
                  }}
                />
              </div>
              <AgentCard role="researcher" state={agentStates.researcher} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "4px 0",
                }}
              >
                <div
                  className={`connector-line ${agentStates.researcher === "done" ? "active" : ""}`}
                  style={{
                    background:
                      agentStates.researcher === "done"
                        ? "linear-gradient(180deg, rgba(0,255,170,0.4), rgba(255,184,0,0.4))"
                        : "var(--border-1)",
                    color:
                      agentStates.researcher === "done"
                        ? "#00ffaa"
                        : "transparent",
                  }}
                />
              </div>
              <AgentCard role="writer" state={agentStates.writer} />
            </div>
            {(isRunning || isComplete || isError) && (
              <div className="rise-d3">
                <LiveLog logs={logs} />
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {(isRunning || isComplete || isError) && (
              <div className="rise-d2">
                <StatBar stats={stats} elapsed={elapsed} status={status} />
              </div>
            )}
            <div className="rise-d3">
              <TaskResult result={result} />
            </div>
          </div>
        </div>

        {isError && (
          <div
            className="rise"
            style={{
              marginTop: "16px",
              padding: "14px 18px",
              background: "var(--rose-soft)",
              border: "1px solid rgba(255,77,106,0.2)",
              borderRadius: "var(--r-md)",
              color: "var(--rose)",
              fontSize: "13px",
              fontWeight: 500,
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span>
              Something went wrong. Check that your backend is running at{" "}
              <code
                style={{
                  background: "rgba(255,77,106,0.1)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                localhost:8000
              </code>{" "}
              and try again.
            </span>
          </div>
        )}
      </div>
    </>
  );
}
