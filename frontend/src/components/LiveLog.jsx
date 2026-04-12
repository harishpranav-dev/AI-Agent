/**
 * module: LiveLog.jsx
 * purpose: Real-time scrolling log feed that displays agent events as they
 *          happen. Each entry gets a colored dot matching its agent, a timestamp,
 *          and the message. Auto-scrolls to show the latest event.
 * author: HP & Mushan
 */

import React, { useEffect, useRef } from "react";

/**
 * Maps log color names (from useAgent hook) to actual CSS colors.
 * The hook tags each log entry with a color string like 'planner', 'researcher', etc.
 */
const DOT_COLORS = {
  planner: "#a78bfa",
  researcher: "#34d399",
  writer: "#fbbf24",
  accent: "var(--accent)",
  emerald: "var(--emerald)",
  rose: "var(--rose)",
  default: "var(--text-4)",
};

/**
 * LiveLog — renders a scrollable list of agent events.
 *
 * Props:
 *   logs — array of { type, message, color, time } from useAgent hook
 */
export default function LiveLog({ logs }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the bottom whenever a new log entry arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--r-lg)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--border-0)",
        }}
      >
        <span
          style={{
            color: "var(--text-1)",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Live Agent Log
        </span>
        <span
          style={{
            color: "var(--text-4)",
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          {logs.length} events
        </span>
      </div>

      {/* Scrollable log area */}
      <div
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          /* Custom scrollbar for dark theme */
          scrollbarWidth: "thin",
          scrollbarColor: "var(--bg-muted) transparent",
        }}
      >
        {logs.length === 0 && (
          <div
            style={{
              color: "var(--text-4)",
              fontSize: "13px",
              textAlign: "center",
              padding: "32px 0",
              fontStyle: "italic",
            }}
          >
            Agent events will appear here...
          </div>
        )}

        {logs.map((log, index) => (
          <div
            key={index}
            className="rise"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "6px 8px",
              borderRadius: "var(--r-sm)",
              background:
                index === logs.length - 1 ? "var(--bg-card)" : "transparent",
              transition: "background 0.3s ease",
            }}
          >
            {/* Colored dot */}
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: DOT_COLORS[log.color] || DOT_COLORS.default,
                flexShrink: 0,
                marginTop: "5px",
              }}
            />

            {/* Message */}
            <span
              style={{
                color: "var(--text-2)",
                fontSize: "12.5px",
                lineHeight: 1.5,
                flex: 1,
                wordBreak: "break-word",
              }}
            >
              {log.message}
            </span>

            {/* Timestamp */}
            <span
              style={{
                color: "var(--text-4)",
                fontSize: "10.5px",
                fontFamily: "monospace",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {log.time}
            </span>
          </div>
        ))}

        {/* Invisible div to scroll to */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
