/**
 * module: Home.jsx
 * purpose: Landing page — cinematic hero, animated pipeline, bento features, stats.
 *          Fully responsive: mobile → tablet → desktop.
 */

import { Link } from "react-router-dom";
import { useState } from "react";

const agents = [
  {
    name: "Planner",
    role: "Strategic Thinker",
    desc: "Analyzes your goal and breaks it into precise, searchable subtasks",
    color: "#7B61FF",
    softBg: "rgba(123, 97, 255, 0.06)",
    border: "rgba(123, 97, 255, 0.18)",
    glowBorder: "rgba(123, 97, 255, 0.4)",
    step: "01",
  },
  {
    name: "Researcher",
    role: "Data Hunter",
    desc: "Searches the web for current information, stats, and sources",
    color: "#00ffaa",
    softBg: "rgba(0, 255, 170, 0.06)",
    border: "rgba(0, 255, 170, 0.18)",
    glowBorder: "rgba(0, 255, 170, 0.4)",
    step: "02",
  },
  {
    name: "Writer",
    role: "Report Architect",
    desc: "Transforms raw research into polished, structured reports",
    color: "#ffb800",
    softBg: "rgba(255, 184, 0, 0.06)",
    border: "rgba(255, 184, 0, 0.18)",
    glowBorder: "rgba(255, 184, 0, 0.4)",
    step: "03",
  },
];

const features = [
  {
    title: "Live Streaming",
    desc: "Watch agents reason in real time via WebSocket",
    wide: true,
    icon: "⚡",
  },
  {
    title: "Web Search",
    desc: "Tavily API powers real internet queries",
    icon: "🌐",
  },
  {
    title: "Task History",
    desc: "MongoDB stores every run for review",
    icon: "📦",
  },
  {
    title: "PDF Export",
    desc: "Download reports as formatted PDFs",
    icon: "📄",
  },
  {
    title: "Custom Prompts",
    desc: "Tune each agent behavior on the fly",
    icon: "🎛️",
  },
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
      {/* ═══ HERO — Cinematic Split Layout ═══ */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "40px",
          alignItems: "center",
          padding: "56px 0 56px",
          minHeight: "min(75vh, 600px)",
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .hero-grid { grid-template-columns: 1.1fr 0.9fr !important; }
          }
        `}</style>

        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <div className="rise" style={{ marginBottom: "24px" }}>
              <span
                className="shimmer-on-hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 16px",
                  borderRadius: "var(--r-full)",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--neon)",
                  background: "var(--neon-soft)",
                  border: "1px solid var(--neon-border)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--neon)",
                    boxShadow: "0 0 8px var(--neon)",
                  }}
                />
                Multi-Agent AI System
              </span>
            </div>

            {/* Heading */}
            <h1
              className="rise-d1 font-display"
              style={{
                fontSize: "clamp(38px, 7vw, 64px)",
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

            {/* Sub */}
            <p
              className="rise-d2"
              style={{
                fontSize: "clamp(15px, 2.5vw, 17px)",
                color: "var(--text-2)",
                maxWidth: "440px",
                lineHeight: 1.7,
                marginBottom: "36px",
              }}
            >
              Submit a goal. Watch autonomous agents plan, research the
              internet, and deliver structured reports — all in real time.
            </p>

            {/* CTAs */}
            <div
              className="rise-d3"
              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
            >
              <Link
                to="/multi"
                className="btn-press btn-neon"
                style={{
                  padding: "13px 28px",
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
          </div>

          {/* Right — Animated floating visual */}
          <div
            className="rise-d4"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              minHeight: "340px",
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: "absolute",
                width: "360px",
                height: "360px",
                background:
                  "radial-gradient(circle, rgba(0,212,255,0.1) 0%, rgba(123,97,255,0.06) 40%, transparent 70%)",
                filter: "blur(50px)",
                animation: "breathe 5s ease-in-out infinite",
              }}
            />

            {/* Connecting flow lines (SVG) */}
            <svg
              style={{
                position: "absolute",
                width: "320px",
                height: "320px",
                zIndex: 0,
                opacity: 0.3,
              }}
              viewBox="0 0 320 320"
              fill="none"
            >
              {/* Planner → Researcher */}
              <path
                d="M140 85 Q200 100 220 160"
                stroke="url(#grad1)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                style={{ animation: "dash-flow 2s linear infinite" }}
              />
              {/* Researcher → Writer */}
              <path
                d="M210 200 Q180 250 140 260"
                stroke="url(#grad2)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                style={{ animation: "dash-flow 2.5s linear infinite" }}
              />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B61FF" />
                  <stop offset="100%" stopColor="#00ffaa" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ffaa" />
                  <stop offset="100%" stopColor="#ffb800" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating glass cards with clear orbit animations */}
            <div
              style={{ position: "relative", width: "320px", height: "320px" }}
            >
              {/* ── Card 1 — Planner ── */}
              <div
                className="hero-card-planner"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "220px",
                  padding: "16px 18px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(8,8,14,0.8)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(123,97,255,0.25)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(123,97,255,0.1)",
                  zIndex: 3,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "3px",
                      background: "#7B61FF",
                      boxShadow: "0 0 6px #7B61FF",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#7B61FF",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Planner Agent
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "9px",
                      fontWeight: 600,
                      color: "rgba(123,97,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Step 01
                  </span>
                </div>
                {/* Content — subtask list */}
                <div
                  style={{
                    fontSize: "10.5px",
                    color: "var(--text-3)",
                    lineHeight: 1.6,
                    fontFamily: "monospace",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "6px", marginBottom: "3px" }}
                  >
                    <span style={{ color: "#7B61FF" }}>✓</span>
                    <span>Break goal into subtasks</span>
                  </div>
                  <div
                    style={{ display: "flex", gap: "6px", marginBottom: "3px" }}
                  >
                    <span style={{ color: "#7B61FF" }}>✓</span>
                    <span>Estimate complexity</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ color: "rgba(123,97,255,0.4)" }}>○</span>
                    <span style={{ color: "var(--text-4)" }}>
                      Validate plan structure
                    </span>
                  </div>
                </div>
                {/* Progress */}
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        color: "var(--text-4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Progress
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#7B61FF",
                        fontWeight: 700,
                      }}
                    >
                      67%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "4px",
                      borderRadius: "2px",
                      background: "rgba(123,97,255,0.12)",
                    }}
                  >
                    <div
                      style={{
                        width: "67%",
                        height: "100%",
                        borderRadius: "2px",
                        background: "linear-gradient(90deg, #7B61FF, #9b85ff)",
                        boxShadow: "0 0 8px rgba(123,97,255,0.3)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Card 2 — Researcher ── */}
              <div
                className="hero-card-researcher"
                style={{
                  position: "absolute",
                  top: "70px",
                  right: "0",
                  width: "210px",
                  padding: "16px 18px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(8,8,14,0.8)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(0,255,170,0.25)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(0,255,170,0.08)",
                  zIndex: 2,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "3px",
                      background: "#00ffaa",
                      boxShadow: "0 0 6px #00ffaa",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#00ffaa",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Researcher Agent
                  </span>
                </div>
                {/* Content — search activity */}
                <div
                  style={{
                    fontSize: "10.5px",
                    lineHeight: 1.7,
                    fontFamily: "monospace",
                  }}
                >
                  <div style={{ color: "var(--text-3)", marginBottom: "2px" }}>
                    <span style={{ color: "#00ffaa", marginRight: "6px" }}>
                      →
                    </span>
                    Searching web for data...
                  </div>
                  <div style={{ color: "#00ffaa", marginBottom: "2px" }}>
                    <span style={{ marginRight: "6px" }}>✓</span>8 sources found
                  </div>
                  <div style={{ color: "#00ffaa", marginBottom: "2px" }}>
                    <span style={{ marginRight: "6px" }}>✓</span>Key findings
                    extracted
                  </div>
                  <div
                    style={{
                      color: "var(--text-4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(0,255,170,0.4)",
                        marginRight: "2px",
                      }}
                    >
                      ●
                    </span>
                    Summarizing results
                    <span
                      style={{
                        display: "inline-block",
                        width: "1px",
                        height: "11px",
                        background: "#00ffaa",
                        animation: "cursor-blink 1s infinite",
                        marginLeft: "2px",
                      }}
                    />
                  </div>
                </div>
                {/* Tool badge */}
                <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 8px",
                      borderRadius: "var(--r-full)",
                      background: "rgba(0,255,170,0.08)",
                      border: "1px solid rgba(0,255,170,0.15)",
                      color: "#00ffaa",
                      fontWeight: 600,
                    }}
                  >
                    web_search
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 8px",
                      borderRadius: "var(--r-full)",
                      background: "rgba(0,212,255,0.06)",
                      border: "1px solid rgba(0,212,255,0.12)",
                      color: "var(--neon)",
                      fontWeight: 600,
                    }}
                  >
                    summarize
                  </span>
                </div>
              </div>

              {/* ── Card 3 — Writer ── */}
              <div
                className="hero-card-writer"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "20px",
                  width: "215px",
                  padding: "16px 18px",
                  borderRadius: "var(--r-md)",
                  background: "rgba(8,8,14,0.8)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,184,0,0.25)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(255,184,0,0.07)",
                  zIndex: 1,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "3px",
                      background: "#ffb800",
                      boxShadow: "0 0 6px #ffb800",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#ffb800",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Writer Agent
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "9px",
                      fontWeight: 600,
                      color: "rgba(255,184,0,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Final
                  </span>
                </div>
                {/* Content — report sections */}
                <div
                  style={{
                    fontSize: "10.5px",
                    lineHeight: 1.6,
                    fontFamily: "monospace",
                  }}
                >
                  <div style={{ color: "#ffb800", marginBottom: "2px" }}>
                    <span style={{ marginRight: "6px" }}>✓</span>Executive
                    Summary
                  </div>
                  <div style={{ color: "#ffb800", marginBottom: "2px" }}>
                    <span style={{ marginRight: "6px" }}>✓</span>Key Findings
                  </div>
                  <div style={{ color: "var(--text-4)", marginBottom: "2px" }}>
                    <span
                      style={{
                        color: "rgba(255,184,0,0.4)",
                        marginRight: "6px",
                      }}
                    >
                      ○
                    </span>
                    Conclusion
                  </div>
                </div>
                {/* Word count indicator */}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      color: "var(--text-4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Output
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#ffb800",
                      fontWeight: 700,
                    }}
                  >
                    847 words
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(255,184,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "78%",
                      height: "100%",
                      borderRadius: "2px",
                      background: "linear-gradient(90deg, #ffb800, #ffd666)",
                      boxShadow: "0 0 8px rgba(255,184,0,0.25)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section
        className="rise-d5"
        style={{
          maxWidth: "500px",
          margin: "0 auto 56px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          border: "1px solid var(--border-1)",
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "20px 8px",
              textAlign: "center",
              borderRight:
                i < stats.length - 1 ? "1px solid var(--border-0)" : "none",
            }}
          >
            <p
              className="font-display"
              style={{
                fontSize: "26px",
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
      <section className="rise-d5" style={{ marginBottom: "64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px",
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
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(90deg, var(--border-1), transparent)",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "14px",
          }}
        >
          {agents.map((a, i) => {
            const isH = hovered === i;
            return (
              <div
                key={a.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="shimmer-on-hover glass-shine"
                style={{
                  padding: "28px 24px",
                  borderRadius: "var(--r-lg)",
                  background: isH
                    ? `linear-gradient(160deg, ${a.softBg}, rgba(0,0,0,0.4))`
                    : "rgba(6,6,8,0.7)",
                  backdropFilter: "blur(20px)",
                  border: `1.5px solid ${isH ? a.glowBorder : "var(--border-1)"}`,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isH ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isH
                    ? `0 20px 56px rgba(0,0,0,0.5), 0 0 30px ${a.softBg}`
                    : "var(--shadow-card)",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: a.color,
                    letterSpacing: "0.12em",
                    opacity: 0.5,
                  }}
                >
                  STEP {a.step}
                </span>

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
                    transition: "all 0.35s ease",
                    transform: isH ? "scale(1.12) rotate(3deg)" : "scale(1)",
                    boxShadow: isH ? `0 0 24px ${a.softBg}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "3px",
                      background: a.color,
                      boxShadow: isH ? `0 0 10px ${a.color}` : "none",
                      transition: "box-shadow 0.3s ease",
                    }}
                  />
                </div>

                <p
                  className="font-display"
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
                    opacity: 0.6,
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
            marginBottom: "22px",
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
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(90deg, var(--border-1), transparent)",
            }}
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
              className="shimmer-on-hover glass-shine"
              style={{
                gridColumn: f.wide ? "1 / -1" : "auto",
                padding: f.wide ? "24px 28px" : "22px 20px",
                borderRadius: "var(--r-md)",
                background: "rgba(6,6,8,0.65)",
                backdropFilter: "blur(16px)",
                border: "1px solid var(--border-1)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)";
                e.currentTarget.style.boxShadow =
                  "0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.04)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "14px" }}>{f.icon}</span>
                <p
                  className="font-display"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-0)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </p>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-3)",
                  lineHeight: 1.55,
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
