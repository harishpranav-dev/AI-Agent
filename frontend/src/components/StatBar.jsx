/**
 * module: StatBar.jsx
 * purpose: Displays a responsive grid of stat cards showing agent run metrics.
 * author: HP & Mushan
 */

import React from "react";

const STATUS_MAP = {
  idle: { label: "Idle", color: "var(--text-4)" },
  running: { label: "Running", color: "var(--neon)" },
  complete: { label: "Complete", color: "var(--emerald)" },
  error: { label: "Error", color: "var(--rose)" },
};

export default function StatBar({ stats, elapsed, status }) {
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.idle;
  const isRunning = status === "running";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const displayTime = status === "running" ? elapsed : stats.time || elapsed;

  const cards = [
    {
      label: "Time",
      value: formatTime(displayTime),
      color: "var(--neon)",
      icon: "⏱",
    },
    {
      label: "Tools Used",
      value: stats.tools,
      color: "var(--purple)",
      icon: "🔧",
    },
    { label: "Steps", value: stats.steps, color: "var(--amber)", icon: "📋" },
    {
      label: "Status",
      value: statusInfo.label,
      color: statusInfo.color,
      icon: "●",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "10px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-shine ${isRunning && card.label === "Time" ? "shimmer-active" : "shimmer-on-hover"}`}
          style={{
            background: "rgba(6,6,8,0.65)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${card.label === "Status" && isRunning ? "var(--neon-border)" : "var(--border-1)"}`,
            borderRadius: "var(--r-md)",
            padding: "16px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ fontSize: "11px", marginBottom: "6px", opacity: 0.4 }}>
            {card.icon}
          </div>
          <div
            className="font-display"
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: card.color,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              fontVariantNumeric: "tabular-nums",
              textShadow:
                isRunning && card.label === "Status"
                  ? `0 0 16px ${card.color}`
                  : "none",
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--text-4)",
              marginTop: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
