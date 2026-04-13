/**
 * module: MultiAgent.jsx
 * purpose: Main Multi-Agent Studio page — the centerpiece of AutoAgent Studio.
 *          Assembles goal input, agent pipeline cards, live log, stat bar,
 *          and task result into a responsive 2-column layout.
 * author: HP & Mushan
 */

import React, { useState } from "react";
import { useAgent } from "../hooks/useAgent";
import AgentCard from "../components/AgentCard";
import LiveLog from "../components/LiveLog";
import StatBar from "../components/StatBar";
import TaskResult from "../components/TaskResult";

/**
 * MultiAgent — full multi-agent UI page.
 *
 * Layout:
 *   Desktop (>768px): 2 columns — left (input + pipeline + log), right (stats + result)
 *   Mobile  (<768px): single column, everything stacks
 */
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

  /** Fires the multi-agent pipeline */
  const handleRun = () => {
    if (!canRun) return;
    run(goal, "multi", customPrompts);
  };

  /** Resets everything for a new run */
  const handleReset = () => {
    reset();
    setGoal("");
  };

  /** Allow Ctrl+Enter / Cmd+Enter to submit */
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canRun) {
      handleRun();
    }
  };

  return (
    <>
      {/* Responsive layout styles */}
      <style>{`
        .multi-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .multi-layout {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }
      `}</style>

      <div style={{ paddingTop: "0", paddingBottom: "48px" }}>
        {/* Page header */}
        <div className="rise" style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "clamp(20px, 3vw, 26px)",
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
            }}
          >
            Enter a goal and watch three AI agents — Planner, Researcher, and
            Writer — collaborate to complete it.
          </p>
        </div>

        {/* Goal input area */}
        <div
          className="rise-d1"
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            marginBottom: "20px",
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
            }}
          />

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            {!isComplete && !isError && (
              <button
                onClick={handleRun}
                disabled={!canRun}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--r-sm)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  background: canRun ? "var(--accent)" : "var(--bg-muted)",
                  border: `1px solid ${canRun ? "var(--accent-border)" : "var(--border-1)"}`,
                  boxShadow: canRun ? "var(--shadow-btn)" : "none",
                  cursor: canRun ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                {isRunning ? "⏳ Agents Working..." : "Run Agents →"}
              </button>
            )}

            {(isComplete || isError) && (
              <button
                onClick={handleReset}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--r-sm)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-1)",
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-2)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
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
                  alignSelf: "center",
                  marginLeft: "4px",
                }}
              >
                Ctrl + Enter to run
              </span>
            )}
          </div>
        </div>
        {/* ── Agent Customization Panel ── */}
        <div className="rise-d1" style={{ marginBottom: "20px" }}>
          <details
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--r-lg)",
              padding: "16px 20px",
            }}
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
              <span>⚙️ Customize Agent Prompts</span>
              <span
                style={{
                  color: "var(--text-4)",
                  fontSize: "11px",
                  fontWeight: 500,
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

            {/* Planner prompt */}
            <div style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                }}
              >
                Planner Agent
              </p>
              <textarea
                value={customPrompts.planner}
                onChange={(e) =>
                  setCustomPrompts((p) => ({ ...p, planner: e.target.value }))
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
                }}
              />
            </div>

            {/* Researcher prompt */}
            <div style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#34d399",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                }}
              >
                Researcher Agent
              </p>
              <textarea
                value={customPrompts.researcher}
                onChange={(e) =>
                  setCustomPrompts((p) => ({
                    ...p,
                    researcher: e.target.value,
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
                }}
              />
            </div>

            {/* Writer prompt */}
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#fbbf24",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                }}
              >
                Writer Agent
              </p>
              <textarea
                value={customPrompts.writer}
                onChange={(e) =>
                  setCustomPrompts((p) => ({ ...p, writer: e.target.value }))
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
                }}
              />
            </div>
          </details>
        </div>

        {/* Main 2-column layout */}
        <div className="multi-layout">
          {/* ====== LEFT COLUMN: Pipeline + Log ====== */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Agent pipeline — 3 cards with arrows between them */}
            <div
              className="rise-d2"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              <AgentCard role="planner" state={agentStates.planner} />

              {/* Arrow connector */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "4px 0",
                }}
              >
                <div
                  style={{
                    width: "2px",
                    height: "20px",
                    background:
                      agentStates.planner === "done"
                        ? "rgba(167,139,250,0.3)"
                        : "var(--border-1)",
                    transition: "background 0.3s ease",
                  }}
                />
              </div>

              <AgentCard role="researcher" state={agentStates.researcher} />

              {/* Arrow connector */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "4px 0",
                }}
              >
                <div
                  style={{
                    width: "2px",
                    height: "20px",
                    background:
                      agentStates.researcher === "done"
                        ? "rgba(52,211,153,0.3)"
                        : "var(--border-1)",
                    transition: "background 0.3s ease",
                  }}
                />
              </div>

              <AgentCard role="writer" state={agentStates.writer} />
            </div>

            {/* Live log — shows when running or complete */}
            {(isRunning || isComplete || isError) && (
              <div className="rise-d3">
                <LiveLog logs={logs} />
              </div>
            )}
          </div>

          {/* ====== RIGHT COLUMN: Stats + Result ====== */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Stat bar — always visible once running starts */}
            {(isRunning || isComplete || isError) && (
              <div className="rise-d2">
                <StatBar stats={stats} elapsed={elapsed} status={status} />
              </div>
            )}

            {/* Task result — shows placeholder then final report */}
            <div className="rise-d3">
              <TaskResult result={result} />
            </div>
          </div>
        </div>

        {/* Error banner */}
        {isError && (
          <div
            className="rise"
            style={{
              marginTop: "16px",
              padding: "14px 18px",
              background: "var(--rose-soft)",
              border: "1px solid rgba(251,113,133,0.2)",
              borderRadius: "var(--r-md)",
              color: "var(--rose)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Something went wrong. Check that your backend is running at{" "}
            <code
              style={{
                background: "rgba(251,113,133,0.1)",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              localhost:8000
            </code>{" "}
            and try again.
          </div>
        )}
      </div>
    </>
  );
}
