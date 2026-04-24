/**
 * module: AgentCard.jsx
 * purpose: Displays a single agent's status during a multi-agent run.
 *          Iron HUD theme: red (planner), gold (researcher), crimson (writer).
 * author: HP & Mushan
 */

import React from "react";

const AGENT_COLORS = {
  planner: {
    color: "#dc2626",
    softBg: "rgba(220,38,38,0.06)",
    border: "rgba(220,38,38,0.18)",
    glowBorder: "rgba(220,38,38,0.45)",
    glowShadow: "rgba(220,38,38,0.12)",
    icon: "🧠",
    label: "Planner",
    desc: "Breaks goals into subtasks",
  },
  researcher: {
    color: "#f59e0b",
    softBg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.18)",
    glowBorder: "rgba(245,158,11,0.45)",
    glowShadow: "rgba(245,158,11,0.12)",
    icon: "🔍",
    label: "Researcher",
    desc: "Searches & gathers data",
  },
  writer: {
    color: "#ef4444",
    softBg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.18)",
    glowBorder: "rgba(239,68,68,0.45)",
    glowShadow: "rgba(239,68,68,0.12)",
    icon: "✍️",
    label: "Writer",
    desc: "Produces the final report",
  },
};

export default function AgentCard({ role, state }) {
  const agent = AGENT_COLORS[role];
  const isThinking = state === "thinking";
  const isDone = state === "done";
  const isWaiting = state === "waiting";

  return (
    <>
      <style>{`
        @keyframes agent-glow-${role} {
          0%, 100% { border-color: ${agent.border}; box-shadow: 0 0 0 0 ${agent.softBg}, inset 0 1px 0 rgba(255,255,255,0.02); }
          50% { border-color: ${agent.glowBorder}; box-shadow: 0 0 32px 4px ${agent.glowShadow}, 0 0 0 1px ${agent.border}, inset 0 1px 0 rgba(255,255,255,0.04); }
        }
      `}</style>

      <div
        className={`glass-shine ${isThinking ? "shimmer-active" : ""}`}
        style={{
          background: isThinking
            ? `linear-gradient(135deg, ${agent.softBg}, rgba(0,0,0,0.3))`
            : isDone
              ? `linear-gradient(135deg, ${agent.softBg}, var(--bg-card))`
              : "rgba(6,6,8,0.65)",
          backdropFilter: "blur(20px)",
          border: `1.5px solid ${isThinking ? agent.glowBorder : isDone ? agent.border : "var(--border-1)"}`,
          borderRadius: "var(--r-lg)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: isWaiting ? 0.4 : 1,
          animation: isThinking
            ? `agent-glow-${role} 2.5s ease-in-out infinite`
            : isDone
              ? "scale-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both"
              : "none",
          position: "relative",
          overflow: "hidden",
          transform: isThinking ? "scale(1.01)" : "scale(1)",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            background: isWaiting ? "var(--bg-subtle)" : agent.softBg,
            border: isWaiting
              ? "1px solid var(--border-0)"
              : `1px solid ${agent.border}`,
            flexShrink: 0,
            transition: "all 0.35s ease",
            boxShadow: isThinking ? `0 0 20px ${agent.glowShadow}` : "none",
          }}
        >
          {isDone ? "✅" : agent.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "2px",
            }}
          >
            <span
              className="font-display"
              style={{
                color: isWaiting ? "var(--text-3)" : agent.color,
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                transition: "color 0.3s ease",
              }}
            >
              {agent.label}
            </span>
          </div>
          <span
            style={{
              color: "var(--text-3)",
              fontSize: "12px",
              lineHeight: 1.3,
            }}
          >
            {agent.desc}
          </span>
        </div>

        <div
          className="font-mono"
          style={{
            padding: "5px 12px",
            borderRadius: "var(--r-full)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            flexShrink: 0,
            color: isThinking
              ? agent.color
              : isDone
                ? "var(--emerald)"
                : "var(--text-4)",
            background: isThinking
              ? agent.softBg
              : isDone
                ? "var(--emerald-soft)"
                : "var(--bg-subtle)",
            border: `1px solid ${isThinking ? agent.border : isDone ? "var(--emerald-border)" : "var(--border-0)"}`,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {isThinking && (
            <span className="typing-dots" style={{ color: agent.color }}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          )}
          {isDone && <span style={{ fontSize: "10px" }}>✓</span>}
          {isWaiting ? "Standby" : isThinking ? "Active" : "Done"}
        </div>
      </div>
    </>
  );
}
