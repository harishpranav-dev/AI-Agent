/**
 * module: Home.jsx
 * purpose: Landing page — editorial hero, animated pipeline, bento features, stats.
 *          Fully responsive: mobile → tablet → desktop.
 */

import { Link } from "react-router-dom";
import { useState } from "react";

const agents = [
  {
    name: "Planner",
    role: "Strategic Thinker",
    desc: "Analyzes your goal and breaks it into precise, searchable subtasks",
    color: "#a78bfa",
    softBg: "rgba(167, 139, 250, 0.08)",
    border: "rgba(167, 139, 250, 0.2)",
    step: "01",
  },
  {
    name: "Researcher",
    role: "Data Hunter",
    desc: "Searches the web for current information, stats, and sources",
    color: "#34d399",
    softBg: "rgba(52, 211, 153, 0.08)",
    border: "rgba(52, 211, 153, 0.2)",
    step: "02",
  },
  {
    name: "Writer",
    role: "Report Architect",
    desc: "Transforms raw research into polished, structured reports",
    color: "#fbbf24",
    softBg: "rgba(251, 191, 36, 0.08)",
    border: "rgba(251, 191, 36, 0.2)",
    step: "03",
  },
];

const features = [
  {
    title: "Live Streaming",
    desc: "Watch agents reason in real time via WebSocket — no waiting for results",
    wide: true,
  },
  { title: "Web Search", desc: "Tavily API powers real internet queries" },
  { title: "Task History", desc: "MongoDB stores every run for review" },
  { title: "PDF Export", desc: "Download reports as formatted PDFs" },
  { title: "Custom Prompts", desc: "Tune each agent behavior on the fly" },
];

const stats = [
  { val: "3", label: "Agents" },
  { val: "4", label: "Tools" },
  { val: "<30s", label: "Avg Time" },
  { val: "∞", label: "Ideas" },
];

export default function Home() {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section style={{ textAlign: "center", padding: "60px 0 48px" }}>
        {/* Badge */}
        <div className="rise" style={{ marginBottom: "24px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "var(--r-full)",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent)",
              background: "var(--accent-soft)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            Multi-Agent AI System
          </span>
        </div>

        {/* Heading */}
        <h1
          className="rise-d1"
          style={{
            fontSize: "clamp(36px, 8vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            marginBottom: "20px",
          }}
        >
          <span style={{ color: "var(--text-0)" }}>Agents that </span>
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa, #7c5cfc, #38bdf8)",
              backgroundSize: "200% 200%",
              animation: "gradient-flow 4s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            plan,
          </span>
          <br />
          <span style={{ color: "var(--text-3)" }}>research & write</span>
        </h1>

        {/* Sub */}
        <p
          className="rise-d2"
          style={{
            fontSize: "clamp(14px, 2.5vw, 16px)",
            color: "var(--text-2)",
            maxWidth: "440px",
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          Submit a goal. Watch AI agents autonomously collaborate — planning
          subtasks, searching the internet, and producing structured reports in
          real time.
        </p>

        {/* CTAs */}
        <div
          className="rise-d3"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/single"
            style={{
              padding: "11px 24px",
              borderRadius: "var(--r-sm)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-1)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-2)",
              boxShadow: "var(--shadow-btn)",
              transition: "all 0.2s ease",
            }}
          >
            Single Agent
          </Link>
          <Link
            to="/multi"
            style={{
              padding: "11px 24px",
              borderRadius: "var(--r-sm)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: "var(--accent)",
              border: "1px solid rgba(167,139,250,0.4)",
              boxShadow:
                "0 2px 20px rgba(124,92,252,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
              transition: "all 0.2s ease",
            }}
          >
            Multi Agent Studio →
          </Link>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section
        className="rise-d4"
        style={{
          maxWidth: "480px",
          margin: "0 auto 48px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          border: "1px solid var(--border-1)",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "16px 8px",
              textAlign: "center",
              background: "var(--bg-raised)",
              borderRight:
                i < stats.length - 1 ? "1px solid var(--border-0)" : "none",
            }}
          >
            <p
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "var(--text-0)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              {s.val}
            </p>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--text-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* ═══ PIPELINE ═══ */}
      <section className="rise-d5" style={{ marginBottom: "56px" }}>
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Agent Pipeline
          </span>
          <div
            style={{ flex: 1, height: "1px", background: "var(--border-1)" }}
          />
        </div>

        {/* Cards — responsive: stack on mobile, row on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {agents.map((a, i) => {
            const isH = hovered === i;
            return (
              <div
                key={a.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "28px 24px",
                  borderRadius: "var(--r-lg)",
                  background: isH ? a.softBg : "var(--bg-raised)",
                  border: `1px solid ${isH ? a.border : "var(--border-1)"}`,
                  transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: isH ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isH
                    ? `0 12px 40px ${a.softBg}, var(--accent-glow)`
                    : "var(--shadow-card)",
                  cursor: "default",
                  position: "relative",
                }}
              >
                {/* Step number */}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: a.color,
                    letterSpacing: "0.12em",
                    opacity: 0.6,
                  }}
                >
                  STEP {a.step}
                </span>

                {/* Icon */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: a.softBg,
                    border: `1px solid ${a.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "14px 0",
                    transition: "transform 0.3s ease",
                    transform: isH ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "3px",
                      background: a.color,
                    }}
                  />
                </div>

                {/* Text */}
                <p
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--text-0)",
                    marginBottom: "2px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {a.name}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: a.color,
                    marginBottom: "10px",
                    opacity: 0.7,
                  }}
                >
                  {a.role}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-3)",
                    lineHeight: 1.55,
                  }}
                >
                  {a.desc}
                </p>

                {/* Connector arrow (desktop only, hidden on wrap) */}
                {i < agents.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-4)",
                      fontSize: "14px",
                      zIndex: 2,
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ FEATURES BENTO ═══ */}
      <section className="rise-d6" style={{ marginBottom: "64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Capabilities
          </span>
          <div
            style={{ flex: 1, height: "1px", background: "var(--border-1)" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "10px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                gridColumn: f.wide ? "1 / -1" : "auto",
                padding: f.wide ? "24px 28px" : "22px 20px",
                borderRadius: "var(--r-md)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border-1)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-3)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-0)",
                  marginBottom: "5px",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-3)",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
