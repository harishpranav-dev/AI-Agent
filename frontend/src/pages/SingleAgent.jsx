/**
 * module: SingleAgent.jsx
 * purpose: Single Agent demo page.
 * author: HP & Mushan
 */

import { useState } from "react";
import { useAgent } from "../hooks/useAgent";

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

const featureIcons = {
  "Agents used": "🤖",
  "Web search": "🔍",
  Steps: "📋",
  Accuracy: "🎯",
  Time: "⚡",
  "Best for": "✨",
};

export default function SingleAgent() {
  const [goal, setGoal] = useState("");
  const { status, result, logs, stats, run, reset } = useAgent();
  const isRunning = status === "running";
  const isComplete = status === "complete";
  const isError = status === "error";

  const handleRun = () => {
    if (!goal.trim() || isRunning) return;
    run(goal.trim(), "single");
  };
  const handleReset = () => {
    reset();
    setGoal("");
  };

  return (
    <>
      <style>{`
        .sa-page { max-width: 960px; margin: 0 auto; padding: 32px 20px 64px; }
        .sa-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .sa-table { width: 100%; min-width: 580px; border-collapse: separate; border-spacing: 0; }
        .sa-runner-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .sa-runner-grid { grid-template-columns: 1fr 1fr; } }
        .sa-textarea { width: 100%; min-height: 120px; resize: vertical; background: var(--bg-card); border: 1px solid var(--border-1); border-radius: var(--r-md); padding: 14px 16px; color: var(--text-0); font-size: 14px; font-family: 'Inter', sans-serif; line-height: 1.6; outline: none; transition: border-color 0.25s ease, box-shadow 0.25s ease; }
        .sa-textarea:focus { border-color: var(--neon); box-shadow: 0 0 0 3px var(--neon-soft), var(--neon-glow); }
        .sa-textarea::placeholder { color: var(--text-3); }
        .sa-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border: none; border-radius: var(--r-full); font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .sa-btn-primary { background: var(--grad-neon); color: #000; box-shadow: 0 2px 20px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2); }
        .sa-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 32px rgba(0,212,255,0.4); }
        .sa-btn-primary:active:not(:disabled) { transform: translateY(0.5px) scale(0.97); }
        .sa-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; background: var(--bg-muted); color: var(--text-3); box-shadow: none; }
        .sa-btn-ghost { background: rgba(255,255,255,0.04); color: var(--text-2); border: 1px solid var(--border-1); }
        .sa-btn-ghost:hover { background: rgba(0,212,255,0.04); color: var(--text-1); border-color: var(--neon-border); }
        @keyframes sa-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .sa-thinking { animation: sa-pulse 1.8s ease-in-out infinite; }
        @keyframes sa-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .sa-fade-in { animation: sa-fadeIn 0.4s ease-out both; }
        .sa-table-row { transition: background 0.2s ease; }
        .sa-table-row:hover { background: rgba(0,212,255,0.02); }
      `}</style>

      <div className="sa-page">
        <div className="rise" style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "2px",
                background: "var(--neon)",
                boxShadow: "0 0 8px var(--neon)",
              }}
            />
            <p
              style={{
                color: "var(--neon)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Single Agent Mode
            </p>
          </div>
          <h1
            className="font-display"
            style={{
              color: "var(--text-0)",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
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

        <div
          className="rise-d1 glass-card-heavy"
          style={{ overflow: "hidden", marginBottom: 40 }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--border-0)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, var(--neon), var(--purple), rgba(0,255,170,0.3))",
                opacity: 0.4,
                borderRadius: "2px 2px 0 0",
              }}
            />
            <h2
              className="font-display"
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
                <tr style={{ background: "rgba(17,17,22,0.6)" }}>
                  {["Feature", "Single Agent", "Multi Agent"].map((h) => (
                    <th
                      key={h}
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
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className="sa-table-row"
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

        <div
          className="rise-d2 glass-card-heavy glass-shine"
          style={{ padding: 24, position: "relative", overflow: "hidden" }}
        >
          <h2
            className="font-display"
            style={{
              color: "var(--text-0)",
              fontSize: 16,
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            Try Single Agent
          </h2>
          <p
            style={{ color: "var(--text-3)", fontSize: 13, margin: "0 0 20px" }}
          >
            Enter a goal and the Writer agent will handle it in one step.
          </p>
          <div className="sa-runner-grid">
            <div>
              <textarea
                className="sa-textarea"
                placeholder="e.g. Explain the key differences between REST and GraphQL APIs..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={isRunning}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  className="sa-btn sa-btn-primary"
                  onClick={handleRun}
                  disabled={!goal.trim() || isRunning}
                >
                  {isRunning ? (
                    <>
                      <span className="typing-dots" style={{ color: "#000" }}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
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
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.06) transparent",
                  }}
                >
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className="log-entry"
                      style={{
                        fontSize: 12,
                        color: "var(--text-3)",
                        fontFamily: "monospace",
                        lineHeight: 1.7,
                        animationDelay: `${Math.min(i * 0.03, 0.2)}s`,
                      }}
                    >
                      <span
                        style={{
                          color: "var(--neon)",
                          marginRight: 6,
                          fontWeight: 700,
                        }}
                      >
                        ›
                      </span>
                      {log.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              {status === "idle" && (
                <div
                  style={{
                    height: "100%",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--border-0)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      marginBottom: "8px",
                      opacity: 0.25,
                    }}
                  >
                    ✍️
                  </div>
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
              {isRunning && (
                <div
                  className="shimmer-active"
                  style={{
                    height: "100%",
                    minHeight: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--neon-border)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      className="breathe"
                      style={{ fontSize: 28, marginBottom: 10 }}
                    >
                      ✍️
                    </div>
                    <p style={{ color: "var(--text-3)", fontSize: 13 }}>
                      Writer agent is thinking...
                    </p>
                    <div
                      className="typing-dots"
                      style={{
                        color: "var(--neon)",
                        justifyContent: "center",
                        marginTop: "8px",
                      }}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
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
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>⚠️</span> Something went wrong
                  </p>
                  <p
                    style={{ color: "var(--text-2)", fontSize: 13, margin: 0 }}
                  >
                    The agent encountered an error. Try again or check the
                    console.
                  </p>
                </div>
              )}
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
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.06) transparent",
                  }}
                >
                  {stats && (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginBottom: 14,
                        paddingBottom: 14,
                        borderBottom: "1px solid var(--border-0)",
                        flexWrap: "wrap",
                      }}
                    >
                      {stats.time > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-3)",
                            padding: "2px 8px",
                            borderRadius: "var(--r-full)",
                            background: "var(--bg-subtle)",
                            border: "1px solid var(--border-0)",
                            fontWeight: 500,
                          }}
                        >
                          ⏱ {stats.time}s
                        </span>
                      )}
                      {stats.tools > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-3)",
                            padding: "2px 8px",
                            borderRadius: "var(--r-full)",
                            background: "var(--bg-subtle)",
                            border: "1px solid var(--border-0)",
                            fontWeight: 500,
                          }}
                        >
                          🔧 {stats.tools} tool call{stats.tools > 1 ? "s" : ""}
                        </span>
                      )}
                      {stats.steps > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-3)",
                            padding: "2px 8px",
                            borderRadius: "var(--r-full)",
                            background: "var(--bg-subtle)",
                            border: "1px solid var(--border-0)",
                            fontWeight: 500,
                          }}
                        >
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
