/**
 * module: History.jsx
 * purpose: Task history — vertical timeline mission log with modal detail.
 *          Iron HUD theme with red/gold accents.
 * author: HP & Mushan
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const response = await axios.get(`${API_URL}/api/history/${sessionId}`);
      const taskList = response.data.tasks || response.data || [];
      setTasks(taskList);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load mission archive");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleExport = (taskId) => {
    setExporting(true);
    window.open(`${API_URL}/api/export/pdf/${taskId}`, "_blank");
    setTimeout(() => setExporting(false), 2000);
  };

  const handleDelete = async (taskId) => {
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/api/history/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
      setSelected(null);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const stripMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/#{1,3}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .slice(0, 120);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <style>{`
        .timeline-entry { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
        .timeline-entry:hover { transform: translateX(4px); }
        .timeline-entry:hover .tl-card { border-color: var(--red-border) !important; background: rgba(220,38,38,0.03) !important; }
        .modal-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: fade-in 0.25s ease; }
        .modal-content { width: 100%; max-width: 700px; max-height: 85vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent; animation: rise 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .modal-report h1 { font-size: 18px; font-weight: 700; color: var(--gold); margin-bottom: 8px; }
        .modal-report h2 { font-size: 16px; font-weight: 600; color: var(--text-0); margin-top: 20px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border-1); }
        .modal-report h3 { font-size: 14px; font-weight: 600; color: var(--text-1); margin-top: 14px; margin-bottom: 6px; }
        .modal-report p { color: var(--text-2); line-height: 1.7; margin-bottom: 10px; font-size: 13px; }
        .modal-report ul, .modal-report ol { padding-left: 20px; margin-bottom: 10px; }
        .modal-report li { color: var(--text-2); line-height: 1.6; font-size: 13px; margin-bottom: 4px; }
        .modal-report strong { color: var(--text-0); }
        .modal-report a { color: var(--red); text-decoration: underline; }
        @media (max-width: 640px) { .modal-content { max-height: 90vh; } }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 0 64px" }}>
        {/* Stats strip */}
        <StatsDashboard />

        {/* Header */}
        <div className="rise" style={{ marginBottom: "32px" }}>
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
                background: "var(--red)",
                boxShadow: "0 0 8px var(--red)",
              }}
            />
            <span
              className="font-mono"
              style={{
                color: "var(--red)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Session History
            </span>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(24px, 4vw, 30px)",
              fontWeight: 800,
              color: "var(--text-0)",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Mission Archive
          </h1>
          <p
            style={{
              color: "var(--text-3)",
              fontSize: "14px",
              marginTop: "6px",
            }}
          >
            All completed agent operations
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "80px 0",
              gap: "14px",
            }}
          >
            <div className="hud-spinner" />
            <span
              className="font-mono"
              style={{
                color: "var(--text-3)",
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Loading mission archive...
            </span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            className="fade-up"
            style={{
              padding: "20px",
              borderRadius: "var(--r-md)",
              background: "var(--rose-soft)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "var(--rose)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tasks.length === 0 && (
          <div
            className="glass-card-heavy glass-shine fade-up hud-corners"
            style={{
              padding: "60px 24px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              className="hud-corners-bottom"
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            />
            <div
              style={{ fontSize: "32px", marginBottom: "14px", opacity: 0.2 }}
            >
              📭
            </div>
            <p
              className="font-display"
              style={{
                color: "var(--text-2)",
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              No missions logged
            </p>
            <p
              style={{
                color: "var(--text-4)",
                fontSize: "13px",
                maxWidth: "300px",
                margin: "0 auto",
                lineHeight: 1.5,
              }}
            >
              Run your first agent task to see it here
            </p>
            <Link
              to="/multi"
              className="btn-press btn-neon"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "24px",
                padding: "10px 24px",
                borderRadius: "var(--r-sm)",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Launch Multi-Agent →
            </Link>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {!loading && !error && tasks.length > 0 && (
          <div style={{ position: "relative", paddingLeft: "32px" }}>
            {/* Vertical timeline line */}
            <div
              style={{
                position: "absolute",
                left: "7px",
                top: "8px",
                bottom: "8px",
                width: "2px",
                background:
                  "linear-gradient(180deg, rgba(220,38,38,0.4), rgba(245,158,11,0.3), rgba(220,38,38,0.1))",
                borderRadius: "2px",
              }}
            />

            {tasks.map((task, i) => (
              <div
                key={task.task_id}
                className="timeline-entry"
                style={{
                  marginBottom: i < tasks.length - 1 ? "16px" : "0",
                  position: "relative",
                  animation: `rise 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
                }}
                onClick={() => setSelected(task)}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-29px",
                    top: "18px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      task.status === "complete"
                        ? "var(--red)"
                        : task.status === "running"
                          ? "var(--gold)"
                          : "var(--text-4)",
                    border: "2px solid var(--bg-base)",
                    boxShadow:
                      task.status === "complete"
                        ? "0 0 8px rgba(220,38,38,0.4)"
                        : "none",
                    zIndex: 2,
                  }}
                />

                {/* Card */}
                <div
                  className="tl-card"
                  style={{
                    padding: "16px 18px",
                    borderRadius: "var(--r-md)",
                    background: "rgba(8,8,8,0.7)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid var(--border-1)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {/* Top meta row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Timestamp */}
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "10px",
                        color: "var(--text-4)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(task.created_at)} ·{" "}
                      {formatTime(task.created_at)}
                    </span>
                    {/* Mode badge */}
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: "var(--r-full)",
                        color:
                          task.mode === "multi" ? "var(--gold)" : "var(--red)",
                        background:
                          task.mode === "multi"
                            ? "var(--gold-soft)"
                            : "var(--red-soft)",
                        border: `1px solid ${task.mode === "multi" ? "var(--gold-border)" : "var(--red-border)"}`,
                      }}
                    >
                      {task.mode}
                    </span>
                    {/* Status */}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color:
                          task.status === "complete"
                            ? "var(--emerald)"
                            : task.status === "running"
                              ? "var(--gold)"
                              : "var(--rose)",
                      }}
                    >
                      ● {task.status}
                    </span>
                  </div>

                  {/* Goal */}
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-0)",
                      marginBottom: "6px",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {task.goal}
                  </p>

                  {/* Preview + stats */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-4)",
                        lineHeight: 1.4,
                        flex: 1,
                        minWidth: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {stripMarkdown(task.report)}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      {task.metadata?.total_time_seconds > 0 && (
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "9px",
                            color: "var(--text-4)",
                            padding: "2px 6px",
                            borderRadius: "var(--r-full)",
                            background: "var(--bg-subtle)",
                            border: "1px solid var(--border-0)",
                          }}
                        >
                          {task.metadata.total_time_seconds}s
                        </span>
                      )}
                      {task.metadata?.tools_called > 0 && (
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "9px",
                            color: "var(--text-4)",
                            padding: "2px 6px",
                            borderRadius: "var(--r-full)",
                            background: "var(--bg-subtle)",
                            border: "1px solid var(--border-0)",
                          }}
                        >
                          {task.metadata.tools_called} tools
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ DETAIL MODAL ══ */}
        {selected && (
          <div
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <div
              className="modal-content glass-card-heavy hud-corners"
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

              {/* Red→Gold gradient top accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background:
                    "linear-gradient(90deg, #dc2626, #f59e0b, #ef4444)",
                  opacity: 0.5,
                }}
              />

              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="btn-press"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  zIndex: 5,
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text-2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ✕
              </button>

              <div style={{ padding: "24px" }}>
                {/* Meta chips */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "14px",
                  }}
                >
                  <MetaChip
                    label="Mode"
                    value={selected.mode}
                    color={
                      selected.mode === "multi" ? "var(--gold)" : "var(--red)"
                    }
                  />
                  <MetaChip
                    label="Status"
                    value={selected.status}
                    color={
                      selected.status === "complete"
                        ? "var(--emerald)"
                        : "var(--gold)"
                    }
                  />
                  {selected.metadata?.total_time_seconds > 0 && (
                    <MetaChip
                      label="Time"
                      value={`${selected.metadata.total_time_seconds}s`}
                      color="var(--red)"
                    />
                  )}
                  {selected.metadata?.tools_called > 0 && (
                    <MetaChip
                      label="Tools"
                      value={selected.metadata.tools_called}
                      color="var(--gold)"
                    />
                  )}
                </div>

                {/* Goal */}
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(16px, 3vw, 20px)",
                    fontWeight: 700,
                    color: "var(--text-0)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.02em",
                    marginBottom: "4px",
                  }}
                >
                  {selected.goal}
                </h2>
                <p
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--text-4)",
                    marginBottom: "20px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatDate(selected.created_at)} ·{" "}
                  {formatTime(selected.created_at)}
                </p>

                {/* Plan subtasks */}
                {selected.plan?.subtasks?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h3
                      className="font-mono"
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "var(--red)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
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
                          background: "var(--red)",
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
                          }}
                        >
                          <span
                            className="font-mono"
                            style={{
                              color: "var(--red)",
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

                {/* Report */}
                {selected.report ? (
                  <div>
                    <h3
                      className="font-mono"
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "var(--gold)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
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
                          background: "var(--gold)",
                        }}
                      />
                      Report
                    </h3>
                    <div
                      className="modal-report"
                      style={{
                        padding: "20px",
                        borderRadius: "var(--r-md)",
                        background: "var(--bg-raised)",
                        border: "1px solid var(--border-0)",
                        maxHeight: "400px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255,255,255,0.06) transparent",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(selected.report),
                      }}
                    />
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
                      : "No report available"}
                  </div>
                )}

                {/* Action buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {selected.report && (
                    <button
                      onClick={() => handleExport(selected.task_id)}
                      disabled={exporting}
                      className={!exporting ? "btn-press btn-neon" : ""}
                      style={{
                        padding: "10px 24px",
                        borderRadius: "var(--r-sm)",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: exporting ? "var(--text-3)" : "#fff",
                        background: exporting
                          ? "var(--bg-muted)"
                          : "var(--grad-primary)",
                        border: "none",
                        cursor: exporting ? "not-allowed" : "pointer",
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
                          />{" "}
                          Exporting...
                        </>
                      ) : (
                        "📄 Export PDF"
                      )}
                    </button>
                  )}

                  {/* Delete — with confirmation */}
                  {confirmDelete === selected.task_id ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "var(--rose)" }}>
                        Confirm delete?
                      </span>
                      <button
                        onClick={() => handleDelete(selected.task_id)}
                        disabled={deleting}
                        className="btn-press"
                        style={{
                          padding: "6px 16px",
                          borderRadius: "var(--r-sm)",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#fff",
                          background: "rgba(239,68,68,0.8)",
                          border: "none",
                          cursor: deleting ? "not-allowed" : "pointer",
                        }}
                      >
                        {deleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="btn-press"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--r-sm)",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--text-2)",
                          background: "var(--bg-subtle)",
                          border: "1px solid var(--border-2)",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(selected.task_id)}
                      className="btn-press"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "var(--r-sm)",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--rose)",
                        background: "transparent",
                        border: "1px solid rgba(239,68,68,0.25)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239,68,68,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Delete Mission
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Helper Components ── */

function MetaChip({ label, value, color }) {
  return (
    <div
      className="font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "var(--r-full)",
        background: "var(--bg-raised)",
        border: "1px solid var(--border-1)",
        fontSize: "10px",
      }}
    >
      <span
        style={{
          color: "var(--text-4)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
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
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
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
