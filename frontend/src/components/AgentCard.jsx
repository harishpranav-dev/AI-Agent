/**
 * module: AgentCard.jsx
 * purpose: Displays a single agent's status during a multi-agent run.
 *          Three visual states: waiting (dim), thinking (glowing pulse),
 *          done (checkmark). Each agent has a unique color identity.
 * author: HP & Mushan
 */

import React from "react";

/**
 * Color map for each agent role.
 * Each agent gets a signature color, soft background, and border.
 */
const AGENT_COLORS = {
  planner: {
    color: "#a78bfa",
    softBg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    glowBorder: "rgba(167,139,250,0.5)",
    icon: "🧠",
    label: "Planner",
    desc: "Breaks goals into subtasks",
  },
  researcher: {
    color: "#34d399",
    softBg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    glowBorder: "rgba(52,211,153,0.5)",
    icon: "🔍",
    label: "Researcher",
    desc: "Searches & gathers data",
  },
  writer: {
    color: "#fbbf24",
    softBg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    glowBorder: "rgba(251,191,36,0.5)",
    icon: "✍️",
    label: "Writer",
    desc: "Produces the final report",
  },
};

/**
 * AgentCard — shows one agent's live status.
 *
 * Props:
 *   role   — 'planner' | 'researcher' | 'writer'
 *   state  — 'waiting' | 'thinking' | 'done'
 */
export default function AgentCard({ role, state }) {
  const agent = AGENT_COLORS[role];
  const isThinking = state === "thinking";
  const isDone = state === "done";
  const isWaiting = state === "waiting";

  return (
    <>
      {/* Scoped keyframe for the glow pulse — only rendered once per card */}
      <style>{`
        @keyframes agent-border-pulse-${role} {
          0%, 100% { border-color: ${agent.border}; box-shadow: 0 0 0 0 ${agent.softBg}; }
          50% { border-color: ${agent.glowBorder}; box-shadow: 0 0 20px 2px ${agent.softBg}; }
        }
      `}</style>

      <div
        style={{
          background: isThinking ? agent.softBg : "var(--bg-card)",
          border: `1.5px solid ${isThinking ? agent.glowBorder : isDone ? agent.border : "var(--border-1)"}`,
          borderRadius: "var(--r-lg)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          transition: "all 0.4s ease",
          opacity: isWaiting ? 0.5 : 1,
          animation: isThinking
            ? `agent-border-pulse-${role} 2s ease-in-out infinite`
            : "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Agent icon */}
        <div
          style={{
            fontSize: "22px",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--r-sm)",
            background: isWaiting ? "var(--bg-subtle)" : agent.softBg,
            flexShrink: 0,
          }}
        >
          {isDone ? "✅" : agent.icon}
        </div>

        {/* Agent info */}
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
              style={{
                color: isWaiting ? "var(--text-3)" : agent.color,
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
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

        {/* Status badge */}
        <div
          style={{
            padding: "4px 10px",
            borderRadius: "var(--r-full)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.03em",
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
            border: `1px solid ${isThinking ? agent.border : isDone ? "rgba(34,197,94,0.2)" : "var(--border-0)"}`,
          }}
        >
          {isThinking && (
            <span
              style={{ marginRight: "4px", display: "inline-block" }}
              className="glow-pulse"
            >
              ●
            </span>
          )}
          {isWaiting ? "Waiting" : isThinking ? "Thinking" : "Done"}
        </div>
      </div>
    </>
  );
}
