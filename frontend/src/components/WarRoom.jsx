/**
 * module: WarRoom.jsx
 * purpose: THE hero visualization — semicircular command center with
 *          SVG superhero helmets, animated state transitions, data flow
 *          particles, live log under active agent, and completion celebration.
 * author: HP & Mushan
 */

import React, { useState, useEffect, useRef } from "react";

/* ─── SVG Helmet Components ─── */

function PlannerHelmet({ active, done }) {
  const o = done ? 0.85 : active ? 1 : 0.35;
  const glowFilter = active ? "url(#plannerGlow)" : "none";
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      style={{
        opacity: o,
        transition: "opacity 0.5s ease",
        filter: glowFilter,
      }}
    >
      <defs>
        <filter id="plannerGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#dc2626" floodOpacity="0.4" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Angular tactical helmet */}
      <path
        d="M45 10 L72 28 L72 58 L58 72 L32 72 L18 58 L18 28 Z"
        fill="rgba(220,38,38,0.08)"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <path
        d="M45 14 L68 30 L68 56 L56 68 L34 68 L22 56 L22 30 Z"
        fill="rgba(220,38,38,0.04)"
        stroke="rgba(220,38,38,0.3)"
        strokeWidth="0.8"
      />
      {/* Visor slit */}
      <rect
        x="28"
        y="38"
        width="34"
        height="6"
        rx="3"
        fill={active ? "#dc2626" : "rgba(220,38,38,0.3)"}
        style={
          active ? { animation: "visor-pulse 1.5s ease-in-out infinite" } : {}
        }
      />
      {/* Cross-hair lines */}
      <line
        x1="45"
        y1="18"
        x2="45"
        y2="32"
        stroke="rgba(245,158,11,0.3)"
        strokeWidth="0.5"
      />
      <line
        x1="45"
        y1="50"
        x2="45"
        y2="64"
        stroke="rgba(245,158,11,0.3)"
        strokeWidth="0.5"
      />
      <line
        x1="25"
        y1="41"
        x2="30"
        y2="41"
        stroke="rgba(245,158,11,0.3)"
        strokeWidth="0.5"
      />
      <line
        x1="60"
        y1="41"
        x2="65"
        y2="41"
        stroke="rgba(245,158,11,0.3)"
        strokeWidth="0.5"
      />
      {/* Gold trim */}
      <path d="M45 10 L48 18 L42 18 Z" fill="rgba(245,158,11,0.4)" />
    </svg>
  );
}

function ResearcherHelmet({ active, done }) {
  const o = done ? 0.85 : active ? 1 : 0.35;
  const glowFilter = active ? "url(#researcherGlow)" : "none";
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      style={{
        opacity: o,
        transition: "opacity 0.5s ease",
        filter: glowFilter,
      }}
    >
      <defs>
        <filter id="researcherGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#f59e0b" floodOpacity="0.4" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Sleek rounded helmet */}
      <ellipse
        cx="45"
        cy="44"
        rx="28"
        ry="30"
        fill="rgba(245,158,11,0.06)"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <ellipse
        cx="45"
        cy="44"
        rx="22"
        ry="24"
        fill="rgba(245,158,11,0.03)"
        stroke="rgba(245,158,11,0.25)"
        strokeWidth="0.8"
      />
      {/* Radar scanning eye */}
      <circle
        cx="45"
        cy="40"
        r="10"
        stroke="rgba(245,158,11,0.4)"
        strokeWidth="0.8"
        fill="none"
      />
      <circle
        cx="45"
        cy="40"
        r="5"
        stroke="rgba(245,158,11,0.6)"
        strokeWidth="0.8"
        fill="none"
      />
      <circle
        cx="45"
        cy="40"
        r="2"
        fill={active ? "#f59e0b" : "rgba(245,158,11,0.3)"}
      />
      {/* Radar sweep line */}
      <line
        x1="45"
        y1="40"
        x2="55"
        y2="33"
        stroke="#f59e0b"
        strokeWidth="1.2"
        opacity={active ? 0.8 : 0.2}
        style={{
          transformOrigin: "45px 40px",
          animation: active ? "spin 2.5s linear infinite" : "none",
        }}
      />
      {/* Red accents */}
      <circle cx="30" cy="35" r="2" fill="rgba(220,38,38,0.4)" />
      <circle cx="60" cy="35" r="2" fill="rgba(220,38,38,0.4)" />
    </svg>
  );
}

function WriterHelmet({ active, done }) {
  const o = done ? 0.85 : active ? 1 : 0.35;
  const glowFilter = active ? "url(#writerGlow)" : "none";
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      style={{
        opacity: o,
        transition: "opacity 0.5s ease",
        filter: glowFilter,
      }}
    >
      <defs>
        <filter id="writerGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#ef4444" floodOpacity="0.4" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Elegant mask */}
      <path
        d="M45 12 C62 12 74 28 74 48 C74 62 62 74 45 74 C28 74 16 62 16 48 C16 28 28 12 45 12"
        fill="rgba(239,68,68,0.06)"
        stroke="#ef4444"
        strokeWidth="1.5"
      />
      <path
        d="M45 18 C58 18 68 30 68 46 C68 58 58 68 45 68 C32 68 22 58 22 46 C22 30 32 18 45 18"
        fill="rgba(239,68,68,0.03)"
        stroke="rgba(239,68,68,0.2)"
        strokeWidth="0.8"
      />
      {/* Eye visor */}
      <path
        d="M28 40 Q45 34 62 40"
        stroke="#ef4444"
        strokeWidth="1.5"
        fill="none"
        opacity={active ? 0.8 : 0.3}
      />
      {/* Quill pen motif */}
      <path
        d="M52 50 L60 30 L62 32 L54 52 Z"
        fill="rgba(245,158,11,0.3)"
        stroke="rgba(245,158,11,0.5)"
        strokeWidth="0.5"
      />
      {/* Gold filigree trim */}
      <path
        d="M30 54 Q45 60 60 54"
        stroke="rgba(245,158,11,0.35)"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray={active ? "0" : "3 2"}
      />
      {/* Writing animation dots */}
      {active && (
        <>
          <circle cx="36" cy="58" r="1.5" fill="#ef4444" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="42" cy="60" r="1.5" fill="#ef4444" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="48" cy="58" r="1.5" fill="#ef4444" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="1.2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  );
}

/* ─── Data Flow Line ─── */
function FlowLine({ active, fromColor, toColor }) {
  return (
    <div
      style={{
        width: "80px",
        height: "2px",
        borderRadius: "2px",
        background: active
          ? `linear-gradient(90deg, ${fromColor}, ${toColor})`
          : "rgba(255,255,255,0.06)",
        transition: "all 0.8s ease",
        position: "relative",
        opacity: active ? 1 : 0.3,
      }}
    >
      {active && (
        <div
          style={{
            position: "absolute",
            top: "-3px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: toColor,
            boxShadow: `0 0 12px ${toColor}`,
            animation: "flow-dot 1.5s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

/* ─── Main WarRoom ─── */
export default function WarRoom({ agentStates, logs, stats, elapsed, status }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState(0);
  const prevStatusRef = useRef(status);

  // Detect completion → trigger celebration
  useEffect(() => {
    if (status === "complete" && prevStatusRef.current === "running") {
      setShowCelebration(true);
      setCelebrationPhase(1);
      const t1 = setTimeout(() => setCelebrationPhase(2), 800);
      const t2 = setTimeout(() => setCelebrationPhase(3), 1800);
      const t3 = setTimeout(() => {
        setShowCelebration(false);
        setCelebrationPhase(0);
      }, 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    prevStatusRef.current = status;
  }, [status]);

  const isRunning = status === "running";
  const isIdle = status === "idle";

  // Find current active agent's latest log
  const activeAgent =
    agentStates.writer === "thinking"
      ? "writer"
      : agentStates.researcher === "thinking"
        ? "researcher"
        : agentStates.planner === "thinking"
          ? "planner"
          : null;

  const latestLog = activeAgent
    ? [...logs].reverse().find((l) => l.color === activeAgent)
    : null;

  const agentData = [
    {
      key: "planner",
      label: "PLANNER",
      id: "AGENT-01",
      color: "#dc2626",
      state: agentStates.planner,
      Helmet: PlannerHelmet,
    },
    {
      key: "researcher",
      label: "RESEARCHER",
      id: "AGENT-02",
      color: "#f59e0b",
      state: agentStates.researcher,
      Helmet: ResearcherHelmet,
    },
    {
      key: "writer",
      label: "WRITER",
      id: "AGENT-03",
      color: "#ef4444",
      state: agentStates.writer,
      Helmet: WriterHelmet,
    },
  ];

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const displayTime = isRunning ? elapsed : stats.time || elapsed;

  return (
    <>
      <style>{`
        @keyframes visor-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; filter: drop-shadow(0 0 6px #dc2626); }
        }
        @keyframes flow-dot {
          0% { left: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: calc(100% - 8px); opacity: 0; }
        }
        @keyframes celebration-pulse {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes mission-text {
          0% { opacity: 0; transform: translateY(10px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .war-room-stage {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: clamp(20px, 4vw, 60px);
          padding: 40px 20px 24px;
          position: relative;
          min-height: 280px;
          perspective: 1200px;
        }
        .agent-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .agent-avatar.active {
          transform: scale(1.12) translateY(-12px);
        }
        .agent-avatar.done {
          transform: scale(1.0);
        }
        .agent-avatar.waiting {
          transform: scale(0.9) translateY(8px);
        }
        .agent-avatar.celebrate {
          transform: scale(1.05) translateY(-4px) !important;
        }
        @media (max-width: 640px) {
          .war-room-stage {
            flex-direction: column;
            align-items: center;
            gap: 16px;
            min-height: auto;
            padding: 24px 16px;
          }
          .flow-line-desktop { display: none; }
        }
        @media (min-width: 641px) {
          .flow-line-mobile { display: none; }
        }
      `}</style>

      <div
        className="glass-card-heavy hud-corners hud-scan"
        style={{
          position: "relative",
          overflow: "hidden",
          borderColor: isRunning ? "var(--red-border)" : "var(--border-1)",
          transition: "border-color 0.5s ease",
        }}
      >
        <div
          className="hud-corners-bottom"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* ── Stats Corner HUD ── */}
        {(isRunning || status === "complete") && (
          <div
            className="font-mono"
            style={{
              position: "absolute",
              top: "14px",
              right: "18px",
              zIndex: 3,
              fontSize: "10px",
              lineHeight: 1.8,
              textAlign: "right",
              color: "var(--text-3)",
              letterSpacing: "0.06em",
            }}
          >
            <div>
              <span style={{ color: "var(--text-4)" }}>TIME </span>
              <span style={{ color: "var(--red)", fontWeight: 700 }}>
                {formatTime(displayTime)}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-4)" }}>TOOLS </span>
              <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                {String(stats.tools).padStart(2, "0")}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-4)" }}>STEPS </span>
              <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                {String(stats.steps).padStart(2, "0")}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-4)" }}>STATUS </span>
              <span
                style={{
                  color: isRunning ? "var(--red)" : "var(--emerald)",
                  fontWeight: 700,
                  textShadow: isRunning
                    ? "0 0 8px rgba(220,38,38,0.5)"
                    : "none",
                }}
              >
                {isRunning ? "ACTIVE" : "DONE"}
              </span>
            </div>
          </div>
        )}

        {/* ── Agent Stage ── */}
        <div className="war-room-stage">
          {agentData.map((agent, i) => {
            const isActive = agent.state === "thinking";
            const isDone = agent.state === "done";
            const isWait = agent.state === "waiting";
            const isCelebrate = showCelebration && celebrationPhase >= 1;
            const stateClass = isCelebrate
              ? "celebrate"
              : isActive
                ? "active"
                : isDone
                  ? "done"
                  : "waiting";

            return (
              <React.Fragment key={agent.key}>
                <div className={`agent-avatar ${stateClass}`}>
                  {/* Agent ID label */}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: agent.color,
                      letterSpacing: "0.1em",
                      opacity: isWait ? 0.3 : 0.6,
                      transition: "opacity 0.5s ease",
                    }}
                  >
                    {agent.id}
                  </span>

                  {/* Helmet */}
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "50%",
                      background: isActive
                        ? `radial-gradient(circle, ${agent.color}15 0%, transparent 70%)`
                        : "transparent",
                      transition: "all 0.5s ease",
                      boxShadow: isActive
                        ? `0 0 40px ${agent.color}20`
                        : "none",
                    }}
                  >
                    <agent.Helmet active={isActive} done={isDone} />
                  </div>

                  {/* Agent name */}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: isWait ? "var(--text-4)" : agent.color,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      transition: "color 0.5s ease",
                      textShadow: isActive
                        ? `0 0 10px ${agent.color}60`
                        : "none",
                    }}
                  >
                    {agent.label}
                  </span>

                  {/* Status badge */}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "8px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "var(--r-full)",
                      background: isActive
                        ? `${agent.color}15`
                        : isDone
                          ? "var(--emerald-soft)"
                          : "var(--bg-subtle)",
                      border: `1px solid ${isActive ? `${agent.color}40` : isDone ? "var(--emerald-border)" : "var(--border-0)"}`,
                      color: isActive
                        ? agent.color
                        : isDone
                          ? "var(--emerald)"
                          : "var(--text-4)",
                      letterSpacing: "0.08em",
                      transition: "all 0.4s ease",
                    }}
                  >
                    {isActive ? "ACTIVE" : isDone ? "COMPLETE" : "STANDBY"}
                  </span>

                  {/* Live log under active agent */}
                  {isActive && latestLog && (
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "11px",
                        color: "var(--text-3)",
                        maxWidth: "180px",
                        textAlign: "center",
                        animation: "fade-up 0.3s ease both",
                        lineHeight: 1.4,
                      }}
                    >
                      {latestLog.message}
                    </div>
                  )}
                </div>

                {/* Flow line between agents (desktop) */}
                {i < 2 && (
                  <div
                    className="flow-line-desktop"
                    style={{ alignSelf: "center", marginBottom: "60px" }}
                  >
                    <FlowLine
                      active={agentData[i].state === "done"}
                      fromColor={agentData[i].color}
                      toColor={agentData[i + 1].color}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Celebration Overlay ── */}
        {showCelebration && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            {/* Gold energy pulse */}
            {celebrationPhase >= 2 && (
              <div
                style={{
                  position: "absolute",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "2px solid rgba(245,158,11,0.5)",
                  animation: "celebration-pulse 1s ease-out forwards",
                }}
              />
            )}
            {/* MISSION COMPLETE text */}
            {celebrationPhase >= 3 && (
              <div
                className="font-mono"
                style={{
                  fontSize: "clamp(16px, 3vw, 24px)",
                  fontWeight: 800,
                  color: "#f59e0b",
                  letterSpacing: "0.15em",
                  textShadow:
                    "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(220,38,38,0.2)",
                  animation: "mission-text 0.5s ease both",
                }}
              >
                MISSION COMPLETE
              </div>
            )}
          </div>
        )}

        {/* ── Idle State ── */}
        {isIdle && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                color: "var(--text-4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Awaiting mission parameters...
            </span>
          </div>
        )}
      </div>
    </>
  );
}
