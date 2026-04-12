/**
 * module: StatBar.jsx
 * purpose: Displays a responsive grid of stat cards showing agent run metrics —
 *          elapsed time, tools called, steps completed, and current status.
 *          Uses large numbers for scannability, dark themed.
 * author: HP & Mushan
 */

import React from "react";

/**
 * Maps status strings to display labels and colors.
 */
const STATUS_MAP = {
  idle: { label: "Idle", color: "var(--text-4)" },
  running: { label: "Running", color: "var(--accent)" },
  complete: { label: "Complete", color: "var(--emerald)" },
  error: { label: "Error", color: "var(--rose)" },
};

/**
 * StatBar — grid of performance metric cards.
 *
 * Props:
 *   stats   — { tools, steps, time } from useAgent
 *   elapsed — live seconds counter
 *   status  — 'idle' | 'running' | 'complete' | 'error'
 */
export default function StatBar({ stats, elapsed, status }) {
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.idle;

  /**
   * Formats seconds into a readable string like "0:24" or "1:05".
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Use live elapsed while running, final recorded time when complete
  const displayTime = status === "running" ? elapsed : stats.time || elapsed;

  const cards = [
    { label: "Time", value: formatTime(displayTime), color: "var(--sky)" },
    { label: "Tools Used", value: stats.tools, color: "var(--accent)" },
    { label: "Steps", value: stats.steps, color: "var(--amber)" },
    { label: "Status", value: statusInfo.label, color: statusInfo.color },
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
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--r-md)",
            padding: "16px",
            textAlign: "center",
          }}
        >
          {/* Large metric value */}
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: card.color,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {card.value}
          </div>

          {/* Label below */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-4)",
              marginTop: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
