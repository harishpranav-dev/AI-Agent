/**
 * module: LiveLog.jsx
 * purpose: Real-time scrolling log feed that displays agent events.
 * author: HP & Mushan
 */

import React, { useEffect, useRef } from "react";

const DOT_COLORS = {
  planner: "#7B61FF",
  researcher: "#00ffaa",
  writer: "#ffb800",
  accent: "var(--neon)",
  emerald: "var(--emerald)",
  rose: "var(--rose)",
  default: "var(--text-4)",
};

export default function LiveLog({ logs }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      className="glass-card-heavy glass-shine"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}
    >
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "5px",
              background: "var(--neon-soft)",
              border: "1px solid var(--neon-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              color: "var(--neon)",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {">"}
          </div>
          <span
            className="font-display"
            style={{
              color: "var(--text-1)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Live Agent Log
          </span>
        </div>
        <span
          style={{
            color: "var(--text-4)",
            fontSize: "11px",
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
            padding: "2px 8px",
            borderRadius: "var(--r-full)",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-0)",
          }}
        >
          {logs.length} events
        </span>
      </div>

      <div
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.06) transparent",
        }}
      >
        {logs.length === 0 && (
          <div
            style={{
              color: "var(--text-4)",
              fontSize: "13px",
              textAlign: "center",
              padding: "36px 0",
              fontStyle: "italic",
            }}
          >
            <div
              style={{ fontSize: "20px", marginBottom: "8px", opacity: 0.3 }}
            >
              ⌘
            </div>
            Agent events will appear here...
          </div>
        )}

        {logs.map((log, index) => {
          const dotColor = DOT_COLORS[log.color] || DOT_COLORS.default;
          const isLatest = index === logs.length - 1;
          return (
            <div
              key={index}
              className="log-entry"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "7px 10px",
                borderRadius: "var(--r-sm)",
                background: isLatest ? "rgba(0,212,255,0.03)" : "transparent",
                borderLeft: isLatest
                  ? `2px solid ${dotColor}`
                  : "2px solid transparent",
                transition: "background 0.3s ease",
                animationDelay: `${Math.min(index * 0.03, 0.3)}s`,
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: dotColor,
                  flexShrink: 0,
                  marginTop: "5px",
                  boxShadow: isLatest ? `0 0 8px ${dotColor}` : "none",
                }}
              />
              <span
                style={{
                  color: isLatest ? "var(--text-1)" : "var(--text-2)",
                  fontSize: "12.5px",
                  lineHeight: 1.5,
                  flex: 1,
                  wordBreak: "break-word",
                }}
              >
                {log.message}
              </span>
              <span
                style={{
                  color: "var(--text-4)",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  flexShrink: 0,
                  marginTop: "2px",
                  fontVariantNumeric: "tabular-nums",
                  opacity: 0.6,
                }}
              >
                {log.time}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
