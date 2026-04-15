/**
 * module: History.jsx
 * purpose: Task history dashboard with split-view layout.
 * author: HP & Mushan
 */

import { useState, useEffect } from "react";
import { getSessionId } from "../utils/session";
import axios from "axios";
import StatsDashboard from "../components/StatsDashboard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function History() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const sessionId = getSessionId();
        const response = await axios.get(`${API_URL}/api/history/${sessionId}`);
        const taskList = response.data.tasks || response.data || [];
        setTasks(taskList);
        if (taskList.length > 0) setSelected(taskList[0]);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load task history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleExport = (taskId) => {
    setExporting(true);
    window.open(`${API_URL}/api/export/pdf/${taskId}`, "_blank");
    setTimeout(() => setExporting(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  const stripMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/#{1,3}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .slice(0, 200);
  };

  return (
    <>
      <style>{`
        .history-layout { display: grid; grid-template-columns: 340px 1fr; gap: 24px; min-height: calc(100vh - 120px); }
        .history-detail-report h1 { font-size: clamp(18px, 3vw, 22px); font-weight: 700; color: var(--neon); margin-bottom: 8px; }
        .history-detail-report h2 { font-size: clamp(15px, 2.5vw, 18px); font-weight: 600; color: var(--text-0); margin-top: 20px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border-1); }
        .history-detail-report h3 { font-size: clamp(13px, 2vw, 15px); font-weight: 600; color: var(--text-1); margin-top: 14px; margin-bottom: 6px; }
        .history-detail-report p { color: var(--text-2); line-height: 1.7; margin-bottom: 10px; font-size: 13px; }
        .history-detail-report ul, .history-detail-report ol { padding-left: 20px; margin-bottom: 10px; }
        .history-detail-report li { color: var(--text-2); line-height: 1.6; font-size: 13px; margin-bottom: 4px; }
        .history-detail-report strong { color: var(--text-0); }
        .history-task-item { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .history-task-item:hover { background: var(--bg-card-hover) !important; border-color: var(--border-2) !important; transform: translateX(3px); }
        @media (max-width: 768px) { .history-layout { grid-template-columns: 1fr; gap: 16px; } .history-sidebar { max-height: 240px; overflow-y: auto; } }
        @media (max-width: 480px) { .history-page-container { padding: 12px !important; } }
      `}</style>

      <div
        className="history-page-container"
        style={{
          padding: "clamp(16px, 4vw, 32px)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <StatsDashboard />

        <div className="rise" style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "2px",
                background: "var(--amber)",
                boxShadow: "0 0 8px var(--amber)",
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
              Session History
            </span>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(22px, 4vw, 28px)",
              fontWeight: 800,
              color: "var(--text-0)",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Task History
          </h1>
          <p
            style={{
              color: "var(--text-3)",
              fontSize: "13px",
              marginTop: "6px",
            }}
          >
            All completed agent runs from this session
          </p>
        </div>

        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: "14px",
            }}
          >
            <div
              className="spin-slow"
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid var(--border-2)",
                borderTopColor: "var(--neon)",
                borderRadius: "50%",
              }}
            />
            <span style={{ color: "var(--text-3)", fontSize: "13px" }}>
              Loading history...
            </span>
          </div>
        )}

        {error && !loading && (
          <div
            className="fade-up"
            style={{
              padding: "20px",
              borderRadius: "var(--r-md)",
              background: "var(--rose-soft)",
              border: "1px solid var(--rose)",
              color: "var(--rose)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            {error}
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div
            className="glass-card-heavy glass-shine fade-up"
            style={{ padding: "60px 24px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "36px", marginBottom: "14px", opacity: 0.25 }}
            >
              📭
            </div>
            <p
              style={{
                color: "var(--text-2)",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              No tasks yet
            </p>
            <p
              style={{
                color: "var(--text-4)",
                fontSize: "13px",
                maxWidth: "320px",
                margin: "0 auto",
                lineHeight: 1.5,
              }}
            >
              Run your first agent task from the Single or Multi Agent page.
            </p>
            <div
              style={{
                width: "40px",
                height: "2px",
                borderRadius: "2px",
                background: "var(--border-1)",
                margin: "16px auto 0",
              }}
            />
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="history-layout fade-up">
            <div
              className="history-sidebar"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {tasks.map((task) => {
                const isSelected = selected?.task_id === task.task_id;
                return (
                  <div
                    key={task.task_id}
                    className="history-task-item shimmer-on-hover"
                    onClick={() => setSelected(task)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--r-md)",
                      background: isSelected
                        ? "rgba(0,212,255,0.04)"
                        : "rgba(6,6,8,0.65)",
                      backdropFilter: "blur(16px)",
                      border: `1.5px solid ${isSelected ? "var(--neon-border)" : "var(--border-1)"}`,
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: isSelected ? "var(--neon-glow)" : "none",
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "15%",
                          bottom: "15%",
                          width: "3px",
                          borderRadius: "0 2px 2px 0",
                          background: "var(--neon)",
                          boxShadow: "0 0 10px var(--neon)",
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          padding: "2px 7px",
                          borderRadius: "var(--r-full)",
                          color:
                            task.mode === "multi"
                              ? "var(--purple)"
                              : "var(--neon)",
                          background:
                            task.mode === "multi"
                              ? "var(--purple-soft)"
                              : "var(--neon-soft)",
                          border: `1px solid ${task.mode === "multi" ? "var(--purple-border)" : "var(--neon-border)"}`,
                        }}
                      >
                        {task.mode}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color:
                            task.status === "complete"
                              ? "var(--emerald)"
                              : task.status === "running"
                                ? "var(--amber)"
                                : "var(--rose)",
                        }}
                      >
                        ● {task.status}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isSelected ? "var(--text-0)" : "var(--text-1)",
                        marginBottom: "4px",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {task.goal}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-4)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(task.created_at)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div>
              {!selected ? (
                <div
                  className="glass-card-heavy glass-shine"
                  style={{ padding: "60px 24px", textAlign: "center" }}
                >
                  <p style={{ color: "var(--text-4)", fontSize: "13px" }}>
                    Select a task to view details
                  </p>
                </div>
              ) : (
                <div
                  className="glass-card-heavy"
                  style={{
                    padding: "24px",
                    position: "relative",
                    overflow: "hidden",
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
                        "linear-gradient(90deg, #7B61FF, #00D4FF, #00ffaa, #ffb800)",
                      opacity: 0.4,
                      borderRadius: "2px 2px 0 0",
                    }}
                  />
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <StatChip
                        label="Mode"
                        value={selected.mode}
                        color={
                          selected.mode === "multi"
                            ? "var(--purple)"
                            : "var(--neon)"
                        }
                      />
                      <StatChip
                        label="Status"
                        value={selected.status}
                        color={
                          selected.status === "complete"
                            ? "var(--emerald)"
                            : "var(--amber)"
                        }
                      />
                      {selected.metadata?.total_time_seconds && (
                        <StatChip
                          label="Time"
                          value={`${selected.metadata.total_time_seconds}s`}
                          color="var(--neon)"
                        />
                      )}
                      {selected.metadata?.tools_called > 0 && (
                        <StatChip
                          label="Tools"
                          value={selected.metadata.tools_called}
                          color="var(--amber)"
                        />
                      )}
                    </div>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "clamp(16px, 3vw, 20px)",
                        fontWeight: 700,
                        color: "var(--text-0)",
                        lineHeight: 1.35,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {selected.goal}
                    </h2>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-4)",
                        marginTop: "10px",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(selected.created_at)}
                    </p>
                  </div>

                  {selected.plan?.subtasks &&
                    selected.plan.subtasks.length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <h3
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--text-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "10px",
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
                              background: "#7B61FF",
                            }}
                          />
                          Plan Subtasks
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          {selected.plan.subtasks.map((subtask, i) => (
                            <div
                              key={i}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "var(--r-sm)",
                                background: "var(--bg-raised)",
                                border: "1px solid var(--border-0)",
                                fontSize: "12px",
                                color: "var(--text-2)",
                                display: "flex",
                                gap: "8px",
                                transition: "border-color 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  "var(--border-2)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                  "var(--border-0)";
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--neon)",
                                  fontWeight: 700,
                                  flexShrink: 0,
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {i + 1}.
                              </span>
                              {typeof subtask === "string"
                                ? subtask
                                : subtask.title ||
                                  subtask.description ||
                                  JSON.stringify(subtask)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selected.report ? (
                    <div>
                      <h3
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          marginBottom: "12px",
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
                            background: "#ffb800",
                          }}
                        />
                        Report
                      </h3>
                      <div
                        className="history-detail-report"
                        style={{
                          padding: "20px",
                          borderRadius: "var(--r-md)",
                          background: "var(--bg-raised)",
                          border: "1px solid var(--border-0)",
                          maxHeight: "500px",
                          overflowY: "auto",
                          scrollbarWidth: "thin",
                          scrollbarColor: "rgba(255,255,255,0.06) transparent",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(selected.report),
                        }}
                      />
                      <button
                        onClick={() => handleExport(selected.task_id)}
                        disabled={exporting}
                        className={!exporting ? "btn-press btn-neon" : ""}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "var(--r-sm)",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: exporting ? "var(--text-3)" : "#000",
                          background: exporting
                            ? "var(--bg-muted)"
                            : "var(--grad-neon)",
                          border: "none",
                          boxShadow: exporting
                            ? "none"
                            : "0 2px 20px rgba(0,212,255,0.2)",
                          cursor: exporting ? "not-allowed" : "pointer",
                          marginTop: "16px",
                          transition: "all 0.25s ease",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {exporting ? (
                          <>
                            <span
                              className="spin-slow"
                              style={{
                                width: "14px",
                                height: "14px",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "#fff",
                                borderRadius: "50%",
                                display: "inline-block",
                              }}
                            />
                            Exporting...
                          </>
                        ) : (
                          <>📄 Export PDF</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "var(--text-4)",
                        fontSize: "13px",
                      }}
                    >
                      {selected.status === "running"
                        ? "Task is still running..."
                        : "No report available for this task"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "var(--r-full)",
        background: "var(--bg-raised)",
        border: "1px solid var(--border-1)",
        fontSize: "11px",
        transition: "border-color 0.2s ease",
      }}
    >
      <span style={{ color: "var(--text-4)" }}>{label}</span>
      <span style={{ color, fontWeight: 700, textTransform: "capitalize" }}>
        {value}
      </span>
    </div>
  );
}

function renderMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(
      /```([\s\S]*?)```/g,
      '<pre style="background:var(--bg-base);padding:12px;border-radius:var(--r-sm);font-size:12px;overflow-x:auto;border:1px solid var(--border-1);color:var(--text-2)">$1</pre>',
    )
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, '<em style="color:var(--text-2)">$1</em>')
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" style="color:var(--neon);text-decoration:underline">$1</a>',
    )
    .replace(
      /^---$/gm,
      '<hr style="border:none;border-top:1px solid var(--border-1);margin:16px 0">',
    )
    .replace(
      /(<li>.*?<\/li>\n?)+/g,
      '<ul style="padding-left:20px;margin:8px 0">$&</ul>',
    )
    .replace(/^(?!<[huplo])((?!<).+)$/gm, "<p>$1</p>");
  return html;
}
