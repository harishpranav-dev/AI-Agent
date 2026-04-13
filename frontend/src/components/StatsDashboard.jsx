/**
 * module: StatsDashboard.jsx
 * purpose: Performance dashboard that shows aggregate stats across all
 *          completed agent runs for this session. Fetches from /api/stats
 *          and displays metric cards in a responsive grid.
 * author: HP & Mushan
 */

import { useState, useEffect } from "react";
import { getSessionId } from "../utils/session";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * StatsDashboard — fetches session stats and renders metric cards.
 *
 * Displayed at the top of the History page. Shows:
 * - Total tasks completed
 * - Average time per task
 * - Total tools called
 * - Multi vs Single agent run counts
 */
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

  // Don't render anything if loading or no completed tasks
  if (loading || !stats || stats.total_tasks === 0) {
    return null;
  }

  /** The five metrics we display */
  const metrics = [
    {
      label: "Total Tasks",
      value: stats.total_tasks,
      icon: "📊",
    },
    {
      label: "Avg Time",
      value: `${stats.avg_time_seconds}s`,
      icon: "⏱️",
    },
    {
      label: "Tools Called",
      value: stats.total_tools_called,
      icon: "🔧",
    },
    {
      label: "Multi-Agent",
      value: stats.multi_agent_runs,
      icon: "🤖",
    },
    {
      label: "Single-Agent",
      value: stats.single_agent_runs,
      icon: "⚡",
    },
  ];

  return (
    <div className="fade-up" style={{ marginBottom: "24px" }}>
      {/* Section label */}
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--text-4)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "12px",
        }}
      >
        Session Performance
      </p>

      {/* Metric cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px",
        }}
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--r-md)",
              padding: "16px 20px",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-1)";
            }}
          >
            {/* Icon + Label row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "13px" }}>{metric.icon}</span>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                {metric.label}
              </p>
            </div>

            {/* Value */}
            <p
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--text-0)",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
