/**
 * module: SingleAgent.jsx
 * purpose: Single Agent demo page — shows a comparison table
 *          (single-step vs multi-step) and lets users run a
 *          single-agent task using only the Writer agent.
 * author: HP & Mushan
 */

import { useState } from "react";
import { useAgent } from "../hooks/useAgent";

/* ── Comparison data ──────────────────────────────────────── */
const COMPARISON = [
  {
    feature: "Agents used",
    single: "1 (Writer only)",
    multi: "3 (Planner + Researcher + Writer)",
  },
  {
    feature: "Web search",
    single: "No — uses AI knowledge",
    multi: "Yes — real internet data",
  },
  {
    feature: "Steps",
    single: "1 direct answer",
    multi: "Plan → Research → Write",
  },
  {
    feature: "Accuracy",
    single: "Good for known topics",
    multi: "High for current/specific topics",
  },
  { feature: "Time", single: "5–10 seconds", multi: "20–60 seconds" },
  {
    feature: "Best for",
    single: "Quick summaries",
    multi: "Deep research reports",
  },
];

/* ── Feature icons (tiny SVG inline) ──────────────────────── */
const featureIcons = {
  "Agents used": "🤖",
  "Web search": "🔍",
  Steps: "📋",
  Accuracy: "🎯",
  Time: "⚡",
  "Best for": "✨",
};

/* ── Main Component ───────────────────────────────────────── */
export default function SingleAgent() {
  const [goal, setGoal] = useState("");
  const { status, result, logs, stats, run, reset } = useAgent();

  const isRunning = status === "running";
  const isComplete = status === "complete";
  const isError = status === "error";

  /**
   * Handles form submission — calls the agent hook in 'single' mode.
   * This tells the backend orchestrator to skip Planner + Researcher
   * and go straight to the Writer agent.
   */
  const handleRun = () => {
    if (!goal.trim() || isRunning) return;
    run(goal.trim(), "single");
  };

  /**
   * Resets the page to initial state so the user can run another task.
   */
  const handleReset = () => {
    reset();
    setGoal("");
  };

  return (
    <>
      {/* ── Scoped responsive styles ── */}
      <style>{`
        .sa-page {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 20px 64px;
        }
        .sa-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .sa-table {
          width: 100%;
          min-width: 580px;
          border-collapse: separate;
          border-spacing: 0;
        }
        .sa-runner-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .sa-runner-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .sa-textarea {
          width: 100%;
          min-height: 120px;
          resize: vertical;
          background: var(--bg-card);
          border: 1px solid var(--border-1);
          border-radius: var(--r-md);
          padding: 14px 16px;
          color: var(--text-0);
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          line-height: 1.6;
          outline: none;
          transition: border-color 0.2s;
        }
        .sa-textarea:focus {
          border-color: var(--accent);
        }
        .sa-textarea::placeholder {
          color: var(--text-3);
        }
        .sa-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 28px;
          border: none;
          border-radius: var(--r-full);
          font-size: 14px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sa-btn-primary {
          background: var(--accent);
          color: #fff;
          box-shadow: var(--shadow-btn);
        }
        .sa-btn-primary:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }
        .sa-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sa-btn-ghost {
          background: var(--bg-subtle);
          color: var(--text-2);
        }
        .sa-btn-ghost:hover {
          background: var(--bg-muted);
          color: var(--text-1);
        }
        @keyframes sa-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .sa-thinking {
          animation: sa-pulse 1.8s ease-in-out infinite;
        }
        @keyframes sa-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sa-fade-in {
          animation: sa-fadeIn 0.4s ease-out both;
        }
      `}</style>

      <div className="sa-page">
        {/* ── Page Header ── */}
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              color: "var(--accent)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Single Agent Mode
          </p>
          <h1
            style={{
              color: "var(--text-0)",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            One Agent, One Answer
          </h1>
          <p
            style={{
              color: "var(--text-2)",
              fontSize: 15,
              lineHeight: 1.6,
              marginTop: 8,
              maxWidth: 560,
            }}
          >
            The single-agent mode sends your goal directly to the Writer agent.
            It's fast but relies on AI knowledge only — no web search, no
            planning step.
          </p>
        </div>

        {/* ── Comparison Table ── */}
        <div
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--border-0)",
            }}
          >
            <h2
              style={{
                color: "var(--text-0)",
                fontSize: 16,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Single-Step vs Multi-Step Comparison
            </h2>
          </div>

          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr style={{ background: "var(--bg-subtle)" }}>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      color: "var(--text-4)",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      color: "var(--text-4)",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Single Agent
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      color: "var(--text-4)",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Multi Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr
                    key={row.feature}
                    style={{
                      borderBottom:
                        idx < COMPARISON.length - 1
                          ? "1px solid var(--border-0)"
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        color: "var(--text-2)",
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ marginRight: 8 }}>
                        {featureIcons[row.feature]}
                      </span>
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: "var(--text-1)",
                        fontSize: 13,
                      }}
                    >
                      {row.single}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: "var(--text-1)",
                        fontSize: 13,
                      }}
                    >
                      {row.multi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Single-Agent Runner ── */}
        <div
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--r-lg)",
            padding: 24,
          }}
        >
          <h2
            style={{
              color: "var(--text-0)",
              fontSize: 16,
              fontWeight: 700,
              margin: "0 0 6px",
            }}
          >
            Try Single Agent
          </h2>
          <p
            style={{
              color: "var(--text-3)",
              fontSize: 13,
              margin: "0 0 20px",
            }}
          >
            Enter a goal and the Writer agent will handle it in one step.
          </p>

          <div className="sa-runner-grid">
            {/* Left column: input */}
            <div>
              <textarea
                className="sa-textarea"
                placeholder="e.g. Explain the key differences between REST and GraphQL APIs..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={isRunning}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <button
                  className="sa-btn sa-btn-primary"
                  onClick={handleRun}
                  disabled={!goal.trim() || isRunning}
                >
                  {isRunning ? (
                    <>
                      <span className="sa-thinking">●</span>
                      Writing...
                    </>
                  ) : (
                    <>▶ Run Agent</>
                  )}
                </button>

                {(isComplete || isError) && (
                  <button className="sa-btn sa-btn-ghost" onClick={handleReset}>
                    ↻ Reset
                  </button>
                )}
              </div>

              {/* Live log feed (shows agent events as they stream in) */}
              {logs.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 14px",
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border-0)",
                    maxHeight: 160,
                    overflowY: "auto",
                  }}
                >
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "var(--text-3)",
                        fontFamily: "monospace",
                        lineHeight: 1.7,
                      }}
                    >
                      <span style={{ color: "var(--accent)", marginRight: 6 }}>
                        ›
                      </span>
                      {log.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column: result */}
            <div>
              {/* Idle state */}
              {status === "idle" && (
                <div
                  style={{
                    height: "100%",
                    minHeight: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--border-0)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--text-4)",
                      fontSize: 13,
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Agent output will appear here
                  </p>
                </div>
              )}

              {/* Running state */}
              {isRunning && (
                <div
                  style={{
                    height: "100%",
                    minHeight: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--border-0)",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      className="sa-thinking"
                      style={{
                        fontSize: 28,
                        marginBottom: 10,
                      }}
                    >
                      ✍️
                    </div>
                    <p
                      style={{
                        color: "var(--text-3)",
                        fontSize: 13,
                      }}
                    >
                      Writer agent is thinking...
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {isError && (
                <div
                  className="sa-fade-in"
                  style={{
                    padding: 20,
                    background: "var(--rose-soft)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--rose)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--rose)",
                      fontSize: 14,
                      fontWeight: 600,
                      margin: "0 0 4px",
                    }}
                  >
                    Something went wrong
                  </p>
                  <p
                    style={{
                      color: "var(--text-2)",
                      fontSize: 13,
                      margin: 0,
                    }}
                  >
                    The agent encountered an error. Try again or check the
                    console.
                  </p>
                </div>
              )}

              {/* Complete state — show result */}
              {isComplete && result && (
                <div
                  className="sa-fade-in"
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--border-1)",
                    padding: 20,
                    maxHeight: 500,
                    overflowY: "auto",
                  }}
                >
                  {/* Stats bar */}
                  {stats && (
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 14,
                        paddingBottom: 14,
                        borderBottom: "1px solid var(--border-0)",
                        flexWrap: "wrap",
                      }}
                    >
                      {stats.time > 0 && (
                        <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                          ⏱ {stats.time}s
                        </span>
                      )}
                      {stats.tools > 0 && (
                        <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                          🔧 {stats.tools} tool call{stats.tools > 1 ? "s" : ""}
                        </span>
                      )}
                      {stats.steps > 0 && (
                        <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                          📋 {stats.steps} step{stats.steps > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      color: "var(--text-1)",
                      fontSize: 13,
                      lineHeight: 1.75,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
