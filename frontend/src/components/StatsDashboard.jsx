/**
 * module: StatsDashboard.jsx
 * purpose: Performance dashboard showing aggregate stats across all completed agent runs.
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
    {
      label: "Total Tasks",
      value: stats.total_tasks,
      icon: "📊",
      accentColor: "var(--neon)",
    },
    {
      label: "Avg Time",
      value: `${stats.avg_time_seconds}s`,
      icon: "⏱️",
      accentColor: "var(--purple)",
    },
    {
      label: "Tools Called",
      value: stats.total_tools_called,
      icon: "🔧",
      accentColor: "var(--amber)",
    },
    {
      label: "Multi-Agent",
      value: stats.multi_agent_runs,
      icon: "🤖",
      accentColor: "#7B61FF",
    },
    {
      label: "Single-Agent",
      value: stats.single_agent_runs,
      icon: "⚡",
      accentColor: "#00ffaa",
    },
  ];

  return (
    <div className="fade-up" style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "2px",
            background: "var(--emerald)",
            boxShadow: "0 0 8px var(--emerald)",
          }}
        />
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
          Session Performance
        </p>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(90deg, var(--border-1), transparent)",
          }}
        />
      </div>

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
            className="shimmer-on-hover glass-shine"
            style={{
              background: "rgba(6,6,8,0.65)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--r-md)",
              padding: "16px 20px",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-2)";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "var(--shadow-float)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "13px" }}>{metric.icon}</span>
              <p
                style={{
                  fontSize: "10px",
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
            <p
              className="font-display"
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--text-0)",
                letterSpacing: "-0.03em",
                margin: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {metric.value}
            </p>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "10%",
                right: "10%",
                height: "2px",
                background: metric.accentColor,
                opacity: 0.12,
                borderRadius: "2px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
