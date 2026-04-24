/**
 * module: StatBar.jsx
 * purpose: HUD-style stat readout grid — Iron HUD theme.
 * author: HP & Mushan
 */

import React from "react";

const STATUS_MAP = {
  idle: { label: "Idle", color: "var(--text-4)" },
  running: { label: "Active", color: "var(--red)" },
  complete: { label: "Complete", color: "var(--emerald)" },
  error: { label: "Error", color: "var(--rose)" },
};

export default function StatBar({ stats, elapsed, status }) {
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.idle;
  const isRunning = status === "running";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const displayTime = status === "running" ? elapsed : stats.time || elapsed;

  const cards = [
    { label: "Time", value: formatTime(displayTime), color: "var(--red)" },
    {
      label: "Tools",
      value: String(stats.tools).padStart(2, "0"),
      color: "var(--gold)",
    },
    {
      label: "Steps",
      value: String(stats.steps).padStart(2, "0"),
      color: "var(--gold)",
    },
    { label: "Status", value: statusInfo.label, color: statusInfo.color },
  ];

  return (
    <div
      className="font-mono"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: "var(--border-1)",
        borderRadius: "var(--r-md)",
        overflow: "hidden",
        border: "1px solid var(--border-1)",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "rgba(8,8,8,0.9)",
            padding: "14px 12px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            {card.label}
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: card.color,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.2,
              textShadow:
                isRunning && card.label === "Status"
                  ? `0 0 12px ${card.color}`
                  : "none",
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
