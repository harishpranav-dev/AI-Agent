/**
 * module: Home.jsx
 * purpose: Landing page — centered hero, HUD agent dossier panels, final CTA.
 *          Iron HUD theme: red/gold accents, targeting reticle corners, scan lines.
 * author: HP & Mushan
 */

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const agents = [
  {
    id: "AGENT-01",
    name: "Planner",
    role: "Strategic Thinker",
    desc: "Analyzes goals and breaks them into precise, searchable subtasks",
    color: "#dc2626",
    softBg: "rgba(220, 38, 38, 0.06)",
    border: "rgba(220, 38, 38, 0.2)",
    glowBorder: "rgba(220, 38, 38, 0.45)",
    glowShadow: "rgba(220, 38, 38, 0.15)",
    iconType: "planner",
  },
  {
    id: "AGENT-02",
    name: "Researcher",
    role: "Data Hunter",
    desc: "Searches the web for current information, stats, and sources",
    color: "#f59e0b",
    softBg: "rgba(245, 158, 11, 0.06)",
    border: "rgba(245, 158, 11, 0.2)",
    glowBorder: "rgba(245, 158, 11, 0.45)",
    glowShadow: "rgba(245, 158, 11, 0.15)",
    iconType: "researcher",
  },
  {
    id: "AGENT-03",
    name: "Writer",
    role: "Report Architect",
    desc: "Transforms raw research into polished, structured reports",
    color: "#ef4444",
    softBg: "rgba(239, 68, 68, 0.06)",
    border: "rgba(239, 68, 68, 0.2)",
    glowBorder: "rgba(239, 68, 68, 0.45)",
    glowShadow: "rgba(239, 68, 68, 0.15)",
    iconType: "writer",
  },
];

/** Animated agent icon SVGs */
function AgentIcon({ type, color, active }) {
  const opacity = active ? 1 : 0.4;
  if (type === "planner") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        style={{ opacity, transition: "opacity 0.5s ease" }}
      >
        <circle
          cx="14"
          cy="14"
          r="10"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          style={{ animation: active ? "spin 6s linear infinite" : "none" }}
        />
        <circle cx="14" cy="14" r="4" fill={color} opacity="0.6">
          {active && (
            <animate
              attributeName="r"
              values="3;5;3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <line
          x1="14"
          y1="2"
          x2="14"
          y2="6"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="14"
          y1="22"
          x2="14"
          y2="26"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="2"
          y1="14"
          x2="6"
          y2="14"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="22"
          y1="14"
          x2="26"
          y2="14"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    );
  }
  if (type === "researcher") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        style={{ opacity, transition: "opacity 0.5s ease" }}
      >
        <circle
          cx="14"
          cy="14"
          r="10"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />
        <circle
          cx="14"
          cy="14"
          r="6"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="14"
          y1="14"
          x2="22"
          y2="8"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.8"
          style={{
            transformOrigin: "14px 14px",
            animation: active ? "spin 3s linear infinite" : "none",
          }}
        />
        <circle cx="14" cy="14" r="2" fill={color} opacity="0.7" />
      </svg>
    );
  }
  // writer
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      style={{ opacity, transition: "opacity 0.5s ease" }}
    >
      <path
        d="M8 22L20 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M20 6L22 8L10 24L8 22"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="9" cy="23" r="2" fill={color} opacity="0.4">
        {active && (
          <animate
            attributeName="opacity"
            values="0.2;0.6;0.2"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <line
        x1="12"
        y1="25"
        x2="22"
        y2="25"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="2 2"
      >
        {active && (
          <animate
            attributeName="strokeDashoffset"
            values="8;0"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </line>
    </svg>
  );
}

export default function Home() {
  const [hovered, setHovered] = useState(null);
  const [litCards, setLitCards] = useState([false, false, false]);

  // Sequential power-on animation
  useEffect(() => {
    const t1 = setTimeout(() => setLitCards([true, false, false]), 400);
    const t2 = setTimeout(() => setLitCards([true, true, false]), 800);
    const t3 = setTimeout(() => setLitCards([true, true, true]), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div>
      {/* ═══ HERO — Centered Apple-style ═══ */}
      <section
        className="rise"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "clamp(60px, 10vh, 100px) 0 clamp(40px, 8vh, 80px)",
          minHeight: "min(70vh, 560px)",
          justifyContent: "center",
        }}
      >
        {/* Badge */}
        <div className="rise" style={{ marginBottom: "28px" }}>
          <span
            className="shimmer-on-hover font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "var(--r-full)",
              fontSize: "10px",
              fontWeight: 600,
              color: "var(--red)",
              background: "var(--red-soft)",
              border: "1px solid var(--red-border)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--red)",
                boxShadow: "0 0 8px var(--red)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
            Multi-Agent AI System
          </span>
        </div>

        {/* Headline */}
        <h1
          className="rise-d1 font-display"
          style={{
            fontSize: "clamp(40px, 8vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: "20px",
          }}
        >
          <span style={{ color: "var(--text-0)" }}>Build Smarter</span>
          <br />
          <span
            className="gradient-text"
            style={{ backgroundSize: "200% 200%" }}
          >
            with AI Agents
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="rise-d2"
          style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "var(--text-2)",
            maxWidth: "500px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          Submit a goal. Watch autonomous agents plan, research the internet,
          and deliver structured reports — all in real time.
        </p>

        {/* CTAs */}
        <div
          className="rise-d3"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/multi"
            className="btn-press btn-neon"
            style={{
              padding: "13px 32px",
              borderRadius: "var(--r-sm)",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Multi Agent →
          </Link>
          <Link
            to="/single"
            className="btn-press btn-glass"
            style={{
              padding: "13px 28px",
              borderRadius: "var(--r-sm)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Single Agent
          </Link>
        </div>
      </section>

      {/* ═══ AGENT HUD DOSSIER PANELS ═══ */}
      <section
        className="rise-d4"
        style={{ marginBottom: "clamp(60px, 10vh, 100px)" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {agents.map((a, i) => {
            const isH = hovered === i;
            const isLit = litCards[i];

            return (
              <div
                key={a.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="hud-corners hud-scan"
                style={{
                  padding: "28px 24px",
                  borderRadius: "var(--r-lg)",
                  background: isH
                    ? `linear-gradient(160deg, ${a.softBg}, rgba(0,0,0,0.4))`
                    : "rgba(8,8,8,0.7)",
                  backdropFilter: "blur(20px)",
                  border: `1.5px solid ${isH ? a.glowBorder : isLit ? a.border : "var(--border-1)"}`,
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isH
                    ? "translateY(-8px) perspective(800px) rotateX(2deg)"
                    : "translateY(0)",
                  boxShadow: isH
                    ? `0 20px 56px rgba(0,0,0,0.5), 0 0 40px ${a.glowShadow}`
                    : "var(--shadow-card)",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  opacity: isLit ? 1 : 0.3,
                  animation: isLit ? `card-power-on 0.6s ease both` : "none",
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {/* Bottom reticle corners */}
                <div
                  className="hud-corners-bottom"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Agent ID */}
                <span
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: a.color,
                    letterSpacing: "0.12em",
                    opacity: 0.6,
                  }}
                >
                  {a.id}
                </span>

                {/* Icon container */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    background: a.softBg,
                    border: `1px solid ${a.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "14px 0",
                    transition: "all 0.35s ease",
                    transform: isH ? "scale(1.1)" : "scale(1)",
                    boxShadow: isH ? `0 0 24px ${a.glowShadow}` : "none",
                  }}
                >
                  <AgentIcon
                    type={a.iconType}
                    color={a.color}
                    active={isH || isLit}
                  />
                </div>

                {/* Name */}
                <p
                  className="font-display"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#f59e0b",
                    marginBottom: "2px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {a.name}
                </p>

                {/* Role */}
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: a.color,
                    marginBottom: "10px",
                    opacity: 0.6,
                  }}
                >
                  {a.role}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-3)",
                    lineHeight: 1.55,
                  }}
                >
                  {a.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section
        className="rise-d5"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "40px",
          position: "relative",
        }}
      >
        {/* Radial glow behind */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "200px",
            background:
              "radial-gradient(ellipse, rgba(220,38,38,0.08) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <Link
          to="/multi"
          className="btn-press btn-neon"
          style={{
            padding: "16px 40px",
            borderRadius: "var(--r-sm)",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            position: "relative",
          }}
        >
          Launch Multi-Agent →
        </Link>
      </section>
    </div>
  );
}
