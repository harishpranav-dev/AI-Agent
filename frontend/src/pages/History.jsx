/**
 * module: History.jsx
 * purpose: Task history dashboard with split-view layout.
 *          Left panel shows all past task runs fetched from MongoDB.
 *          Right panel shows the detail/report of the selected task.
 *          Includes PDF export button and mobile-responsive layout.
 * author: HP & Mushan
 */

import { useState, useEffect } from "react";
import { getSessionId } from "../utils/session";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function History() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  /**
   * Fetch all tasks for this browser session from MongoDB.
   * Runs once on mount.
   */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const sessionId = getSessionId();
        const response = await axios.get(`${API_URL}/api/history/${sessionId}`);
        const taskList = response.data.tasks || response.data || [];
        setTasks(taskList);
        // Auto-select the most recent task if any exist
        if (taskList.length > 0) {
          setSelected(taskList[0]);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load task history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  /**
   * Open the PDF export endpoint in a new tab.
   * The browser will download the file automatically.
   */
  const handleExport = (taskId) => {
    setExporting(true);
    window.open(`${API_URL}/api/export/pdf/${taskId}`, "_blank");
    // Reset exporting state after a short delay
    setTimeout(() => setExporting(false), 2000);
  };

  /**
   * Format an ISO timestamp into a readable date string.
   */
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

  /**
   * Convert markdown bold markers to simple text for preview.
   */
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
      {/* ── Scoped responsive styles ── */}
      <style>{`
        .history-layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          min-height: calc(100vh - 120px);
        }
        .history-detail-report h1 {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 8px;
        }
        .history-detail-report h2 {
          font-size: clamp(15px, 2.5vw, 18px);
          font-weight: 600;
          color: var(--text-0);
          margin-top: 20px;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-1);
        }
        .history-detail-report h3 {
          font-size: clamp(13px, 2vw, 15px);
          font-weight: 600;
          color: var(--text-1);
          margin-top: 14px;
          margin-bottom: 6px;
        }
        .history-detail-report p {
          color: var(--text-2);
          line-height: 1.7;
          margin-bottom: 10px;
          font-size: 13px;
        }
        .history-detail-report ul,
        .history-detail-report ol {
          padding-left: 20px;
          margin-bottom: 10px;
        }
        .history-detail-report li {
          color: var(--text-2);
          line-height: 1.6;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .history-detail-report strong {
          color: var(--text-0);
        }
        @media (max-width: 768px) {
          .history-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .history-sidebar {
            max-height: 240px;
            overflow-y: auto;
          }
        }
        @media (max-width: 480px) {
          .history-page-container {
            padding: 12px !important;
          }
        }
      `}</style>

      <div
        className="history-page-container"
        style={{
          padding: "clamp(16px, 4vw, 32px)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* ── Page Header ── */}
        <div className="fade-up" style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 28px)",
              fontWeight: 800,
              color: "var(--text-0)",
              margin: 0,
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

        {/* ── Loading State ── */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
            }}
          >
            <div
              className="spin-slow"
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid var(--border-2)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                marginLeft: "12px",
                color: "var(--text-3)",
                fontSize: "13px",
              }}
            >
              Loading history...
            </span>
          </div>
        )}

        {/* ── Error State ── */}
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
            }}
          >
            {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && tasks.length === 0 && (
          <div
            className="fade-up"
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "var(--text-3)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <p style={{ fontSize: "15px", fontWeight: 600 }}>No tasks yet</p>
            <p style={{ fontSize: "13px", marginTop: "6px" }}>
              Run an agent from the Home or Multi-Agent page to see history
              here.
            </p>
          </div>
        )}

        {/* ── Main Layout: Sidebar + Detail ── */}
        {!loading && !error && tasks.length > 0 && (
          <div className="history-layout fade-up">
            {/* ──────── Left Sidebar: Task List ──────── */}
            <div className="history-sidebar">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {tasks.map((task, index) => (
                  <button
                    key={task.task_id || index}
                    onClick={() => setSelected(task)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: "var(--r-md)",
                      border:
                        selected?.task_id === task.task_id
                          ? "1px solid var(--accent-border)"
                          : "1px solid var(--border-1)",
                      background:
                        selected?.task_id === task.task_id
                          ? "var(--accent-soft)"
                          : "var(--bg-card)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selected?.task_id !== task.task_id) {
                        e.currentTarget.style.background =
                          "var(--bg-card-hover)";
                        e.currentTarget.style.borderColor = "var(--border-2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selected?.task_id !== task.task_id) {
                        e.currentTarget.style.background = "var(--bg-card)";
                        e.currentTarget.style.borderColor = "var(--border-1)";
                      }
                    }}
                  >
                    {/* Task goal */}
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color:
                          selected?.task_id === task.task_id
                            ? "var(--text-0)"
                            : "var(--text-1)",
                        marginBottom: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.goal || "Untitled task"}
                    </div>

                    {/* Meta row: mode + date */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "11px",
                        color: "var(--text-3)",
                      }}
                    >
                      {/* Mode badge */}
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "var(--r-full)",
                          fontSize: "10px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          background:
                            task.mode === "multi"
                              ? "var(--accent-soft)"
                              : "var(--emerald-soft)",
                          color:
                            task.mode === "multi"
                              ? "var(--accent)"
                              : "var(--emerald)",
                          border: `1px solid ${
                            task.mode === "multi"
                              ? "var(--accent-border)"
                              : "rgba(34,197,94,0.28)"
                          }`,
                        }}
                      >
                        {task.mode || "single"}
                      </span>
                      <span>{formatDate(task.created_at)}</span>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        marginTop: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background:
                            task.status === "complete"
                              ? "var(--emerald)"
                              : task.status === "failed"
                                ? "var(--rose)"
                                : "var(--amber)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-4)",
                          textTransform: "capitalize",
                        }}
                      >
                        {task.status || "unknown"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ──────── Right Panel: Task Detail ──────── */}
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border-1)",
                padding: "clamp(16px, 3vw, 28px)",
                minHeight: "400px",
                overflow: "hidden",
              }}
            >
              {!selected ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--text-4)",
                    fontSize: "13px",
                  }}
                >
                  Select a task to view details
                </div>
              ) : (
                <div className="fade-up">
                  {/* ── Task Header ── */}
                  <div
                    style={{
                      marginBottom: "20px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid var(--border-1)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "clamp(16px, 3vw, 20px)",
                        fontWeight: 700,
                        color: "var(--text-0)",
                        margin: 0,
                        marginBottom: "8px",
                      }}
                    >
                      {selected.goal}
                    </h2>

                    {/* ── Stats Row ── */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginTop: "10px",
                      }}
                    >
                      {/* Mode */}
                      <StatChip
                        label="Mode"
                        value={selected.mode || "single"}
                        color="var(--accent)"
                      />
                      {/* Status */}
                      <StatChip
                        label="Status"
                        value={selected.status || "unknown"}
                        color={
                          selected.status === "complete"
                            ? "var(--emerald)"
                            : selected.status === "failed"
                              ? "var(--rose)"
                              : "var(--amber)"
                        }
                      />
                      {/* Time */}
                      {selected.metadata?.total_time_seconds && (
                        <StatChip
                          label="Time"
                          value={`${selected.metadata.total_time_seconds}s`}
                          color="var(--sky)"
                        />
                      )}
                      {/* Tools */}
                      {selected.metadata?.tools_called !== undefined && (
                        <StatChip
                          label="Tools"
                          value={selected.metadata.tools_called}
                          color="var(--amber)"
                        />
                      )}
                      {/* Steps */}
                      {selected.metadata?.steps_completed !== undefined && (
                        <StatChip
                          label="Steps"
                          value={selected.metadata.steps_completed}
                          color="var(--accent)"
                        />
                      )}
                    </div>

                    {/* ── Date ── */}
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-4)",
                        marginTop: "10px",
                      }}
                    >
                      {formatDate(selected.created_at)}
                    </p>
                  </div>

                  {/* ── Plan Section (if available) ── */}
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
                          }}
                        >
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
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--accent)",
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {i + 1}.
                              </span>
                              {subtask}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* ── Report Section ── */}
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
                        }}
                      >
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
                        }}
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(selected.report),
                        }}
                      />

                      {/* ── Export PDF Button ── */}
                      <button
                        onClick={() => handleExport(selected.task_id)}
                        disabled={exporting}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "var(--r-sm)",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#fff",
                          background: exporting
                            ? "var(--bg-muted)"
                            : "var(--accent)",
                          border: "1px solid var(--accent-border)",
                          boxShadow: "var(--shadow-btn)",
                          cursor: exporting ? "not-allowed" : "pointer",
                          marginTop: "16px",
                          transition: "all 0.15s ease",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                        onMouseEnter={(e) => {
                          if (!exporting) {
                            e.currentTarget.style.background =
                              "var(--accent-hover)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!exporting) {
                            e.currentTarget.style.background = "var(--accent)";
                          }
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

/**
 * StatChip — Small colored stat indicator used in the detail header.
 */
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
      }}
    >
      <span style={{ color: "var(--text-4)" }}>{label}</span>
      <span style={{ color, fontWeight: 700, textTransform: "capitalize" }}>
        {value}
      </span>
    </div>
  );
}

/**
 * Simple markdown → HTML converter for rendering reports.
 * Handles headings, bold, italic, lists, code blocks, and links.
 * This keeps us from needing an external markdown library in the frontend.
 */
function renderMarkdown(md) {
  if (!md) return "";

  let html = md
    // Code blocks (```...```)
    .replace(
      /```([\s\S]*?)```/g,
      '<pre style="background:var(--bg-base);padding:12px;border-radius:var(--r-sm);font-size:12px;overflow-x:auto;border:1px solid var(--border-1);color:var(--text-2)">$1</pre>',
    )
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, '<em style="color:var(--text-2)">$1</em>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline">$1</a>',
    )
    // Horizontal rules
    .replace(
      /^---$/gm,
      '<hr style="border:none;border-top:1px solid var(--border-1);margin:16px 0">',
    )
    // Wrap consecutive <li> in <ul>
    .replace(
      /(<li>.*?<\/li>\n?)+/g,
      '<ul style="padding-left:20px;margin:8px 0">$&</ul>',
    )
    // Paragraphs: remaining lines
    .replace(/^(?!<[huplo])((?!<).+)$/gm, "<p>$1</p>");

  return html;
}
