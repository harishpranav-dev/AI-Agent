/**
 * module: SingleAgent.jsx
 * purpose: Single Agent demo page — Iron HUD theme.
 *          Side-by-side: comparison table + goal input/result.
 * author: HP & Mushan
 */

import { useState } from "react";
import { useAgent } from "../hooks/useAgent";
import TypingPlaceholder from "../components/TypingPlaceholder";

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
    multi: "High for current topics",
  },
  { feature: "Time", single: "5–10 seconds", multi: "20–60 seconds" },
  {
    feature: "Best for",
    single: "Quick summaries",
    multi: "Deep research reports",
  },
];

const SUGGESTIONS = [
  "Summarize the key benefits of renewable energy...",
  "Explain quantum computing in simple terms...",
  "Compare Python and JavaScript for web development...",
  "Write a brief history of artificial intelligence...",
  "Analyze the impact of social media on society...",
];

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
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "Enter" &&
      goal.trim() &&
      !isRunning
    )
      handleRun();
  };

  return (
    <>
      <style>{`
        .sa-layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .sa-layout { grid-template-columns: 1fr 1fr; } }
        .sa-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .sa-table { width: 100%; min-width: 520px; border-collapse: separate; border-spacing: 0; }
        .sa-table-row { transition: background 0.2s ease; }
        .sa-table-row:hover { background: rgba(220,38,38,0.02); }
      `}</style>

      <div
        style={{ maxWidth: "1060px", margin: "0 auto", padding: "0 0 64px" }}
      >
        {/* Header */}
        <div className="rise" style={{ marginBottom: 32 }}>
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
                background: "var(--red)",
                boxShadow: "0 0 8px var(--red)",
              }}
            />
            <span
              className="font-mono"
              style={{
                color: "var(--red)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Single Agent Mode
            </span>
          </div>
          <h1
            className="font-display"
            style={{
              color: "var(--text-0)",
              fontSize: "clamp(24px, 4vw, 30px)",
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
              fontSize: 14,
              lineHeight: 1.6,
              marginTop: 6,
              maxWidth: 560,
            }}
          >
            The single-agent mode sends your goal directly to the Writer agent —
            fast but relies on AI knowledge only.
          </p>
        </div>

        {/* ── Comparison Table ── */}
        <div
          className="rise-d1 glass-card-heavy hud-corners"
          style={{ overflow: "hidden", marginBottom: 28, position: "relative" }}
        >
          <div
            className="hud-corners-bottom"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />
          <div
            style={{
              padding: "14px 20px",
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
                background: "linear-gradient(90deg, #dc2626, #f59e0b)",
                opacity: 0.4,
                borderRadius: "2px 2px 0 0",
              }}
            />
            <h2
              className="font-mono"
              style={{
                color: "var(--text-1)",
                fontSize: 11,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Single-Step vs Multi-Step
            </h2>
          </div>
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr style={{ background: "rgba(17,17,17,0.6)" }}>
                  {["Feature", "Single Agent", "Multi Agent"].map((h) => (
                    <th
                      key={h}
                      className="font-mono"
                      style={{
                        padding: "10px 18px",
                        textAlign: "left",
                        color: "var(--text-4)",
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
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
                        padding: "12px 18px",
                        color: "var(--text-2)",
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: "12px 18px",
                        color: "var(--text-2)",
                        fontSize: 13,
                      }}
                    >
                      {row.single}
                    </td>
                    <td
                      style={{
                        padding: "12px 18px",
                        color: "var(--red)",
                        fontSize: 13,
                        fontWeight: 500,
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

        {/* ── Two-column: Input + Result ── */}
        <div className="sa-layout">
          {/* Left: Goal Input */}
          <div className="rise-d2">
            <div
              className="glass-card-heavy glass-shine"
              style={{ padding: 20 }}
            >
              <label
                className="font-mono"
                style={{
                  color: "var(--text-3)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                  display: "block",
                }}
              >
                Your Goal
              </label>

              <TypingPlaceholder
                suggestions={SUGGESTIONS}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
                rows={4}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 14,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {!isComplete && !isError && (
                  <button
                    onClick={handleRun}
                    disabled={!goal.trim() || isRunning}
                    className={
                      goal.trim() && !isRunning ? "btn-press btn-neon" : ""
                    }
                    style={{
                      padding: "10px 24px",
                      borderRadius: "var(--r-sm)",
                      fontSize: "13px",
                      fontWeight: 700,
                      color:
                        goal.trim() && !isRunning ? "#fff" : "var(--text-3)",
                      background:
                        goal.trim() && !isRunning
                          ? "var(--grad-primary)"
                          : "var(--bg-muted)",
                      border: "none",
                      cursor:
                        goal.trim() && !isRunning ? "pointer" : "not-allowed",
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
                        Writing...
                      </>
                    ) : (
                      "Run Agent →"
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
                {!isRunning && goal.trim() && (
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

              {/* Mini log */}
              {logs.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 14px",
                    background: "var(--bg-card)",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border-0)",
                    maxHeight: 140,
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
                        fontFamily: '"JetBrains Mono", monospace',
                        lineHeight: 1.7,
                        animationDelay: `${Math.min(i * 0.03, 0.2)}s`,
                      }}
                    >
                      <span
                        style={{
                          color: "var(--red)",
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
          </div>

          {/* Right: Result */}
          <div className="rise-d3">
            {status === "idle" && (
              <div
                className="glass-card-heavy glass-shine"
                style={{
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 40,
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "10px",
                    opacity: 0.2,
                  }}
                >
                  ✍️
                </div>
                <p
                  className="font-mono"
                  style={{
                    color: "var(--text-4)",
                    fontSize: 10,
                    textAlign: "center",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Agent output will appear here
                </p>
              </div>
            )}

            {isRunning && (
              <div
                className="shimmer-active glass-card-heavy"
                style={{
                  minHeight: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid var(--red-border)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    className="breathe"
                    style={{ fontSize: 28, marginBottom: 10 }}
                  >
                    ✍️
                  </div>
                  <p
                    className="font-mono"
                    style={{
                      color: "var(--text-3)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Writer agent processing...
                  </p>
                  <div
                    className="typing-dots"
                    style={{
                      color: "var(--red)",
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
                style={{
                  padding: 20,
                  background: "var(--rose-soft)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid rgba(239,68,68,0.3)",
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
                <p style={{ color: "var(--text-2)", fontSize: 13, margin: 0 }}>
                  Please try again or check the console.
                </p>
              </div>
            )}

            {isComplete && result && (
              <div
                className="glass-card-heavy hud-corners"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <div
                  className="hud-corners-bottom"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, #dc2626, #f59e0b)",
                    opacity: 0.4,
                  }}
                />
                {stats && (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "14px 18px",
                      borderBottom: "1px solid var(--border-0)",
                      flexWrap: "wrap",
                    }}
                  >
                    {stats.time > 0 && (
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 10,
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
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          color: "var(--text-3)",
                          padding: "2px 8px",
                          borderRadius: "var(--r-full)",
                          background: "var(--bg-subtle)",
                          border: "1px solid var(--border-0)",
                          fontWeight: 500,
                        }}
                      >
                        🔧 {stats.tools} tool{stats.tools > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
                <div
                  style={{
                    padding: 18,
                    maxHeight: 400,
                    overflowY: "auto",
                    color: "var(--text-1)",
                    fontSize: 13,
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.06) transparent",
                  }}
                >
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
