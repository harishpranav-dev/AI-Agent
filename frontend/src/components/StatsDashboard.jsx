/**
 * module: StatsDashboard.jsx
 * purpose: Session performance stats strip — Iron HUD theme.
 * author: HP & Mushan
 */

import { useState, useEffect } from "react";
import { getSessionId } from "../utils/session";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sessionId = getSessionId();
        const response = await axios.get(`${API_URL}/api/stats/${sessionId}`);
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats || stats.total_tasks === 0) return null;

  const metrics = [
    { label: "Total Missions", value: stats.total_tasks, color: "var(--red)" },
    {
      label: "Avg Time",
      value: `${stats.avg_time_seconds}s`,
      color: "var(--gold)",
    },
    {
      label: "Tools Called",
      value: stats.total_tools_called,
      color: "var(--gold)",
    },
    { label: "Multi-Agent", value: stats.multi_agent_runs, color: "#dc2626" },
    { label: "Single-Agent", value: stats.single_agent_runs, color: "#ef4444" },
  ];

  return (
    <div className="rise" style={{ marginBottom: "24px" }}>
      <div
        className="font-mono"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          border: "1px solid var(--border-1)",
          background: "var(--border-1)",
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              flex: "1 1 0",
              minWidth: "100px",
              background: "rgba(8,8,8,0.9)",
              padding: "12px 16px",
              textAlign: "center",
              borderRight:
                i < metrics.length - 1 ? "1px solid var(--border-1)" : "none",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                color: "var(--text-4)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "4px",
                fontWeight: 600,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: m.color,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
