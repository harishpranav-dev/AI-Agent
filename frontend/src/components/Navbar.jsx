/**
 * module: Navbar.jsx
 * purpose: Sticky frosted navbar — desktop pill tabs + mobile hamburger.
 *          Fully responsive. Glass morphism on dark with neon accents.
 */

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const tabs = [
  { path: "/", label: "Home" },
  { path: "/single", label: "Single Agent" },
  { path: "/multi", label: "Multi Agent" },
  { path: "/history", label: "History" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "saturate(180%) blur(28px)",
          WebkitBackdropFilter: "saturate(180%) blur(28px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Top neon shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "3%",
            right: "3%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), rgba(123,97,255,0.15), rgba(0,212,255,0.1), transparent)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container-main"
          style={{
            height: "58px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Brand ── */}
          <Link
            to="/"
            className="btn-press"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "var(--grad-neon)",
                backgroundSize: "200% 200%",
                animation: "gradient-flow 4s ease infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 2px 20px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <span
                style={{
                  color: "#000",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  fontFamily: "Outfit, Inter, sans-serif",
                }}
              >
                AI
              </span>
            </div>
            <span
              className="font-display"
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-0)",
                letterSpacing: "-0.02em",
              }}
            >
              General-Agent
            </span>
          </Link>

          {/* ── Desktop Tabs ── */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              padding: "4px",
              borderRadius: "12px",
              background: "rgba(10,10,15,0.6)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border-1)",
            }}
            className="desktop-tabs"
          >
            {tabs.map((tab) => {
              const active = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--neon)" : "var(--text-3)",
                    background: active ? "rgba(0,212,255,0.06)" : "transparent",
                    border: active
                      ? "1px solid rgba(0,212,255,0.15)"
                      : "1px solid transparent",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: active
                      ? "0 0 12px rgba(0,212,255,0.08)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-1)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-3)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* ── Status (desktop) ── */}
          <div
            className="desktop-status"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px 4px 8px",
              borderRadius: "var(--r-full)",
              background: "var(--emerald-soft)",
              border: "1px solid var(--emerald-border)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--emerald)",
                boxShadow: "0 0 10px rgba(0,255,170,0.5)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--emerald)",
                letterSpacing: "0.03em",
              }}
            >
              Live
            </span>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu-overlay"
            style={{
              display: "none",
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-2)",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              color: "var(--text-1)",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div
          id="mobile-menu-overlay"
          role="menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            paddingTop: "60px",
          }}
        >
          {tabs.map((tab, i) => {
            const active = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setMobileOpen(false)}
                className="rise"
                style={{
                  padding: "14px 48px",
                  borderRadius: "var(--r-md)",
                  fontSize: "16px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--neon)" : "var(--text-2)",
                  background: active ? "var(--neon-soft)" : "transparent",
                  border: active
                    ? "1px solid var(--neon-border)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  width: "240px",
                  textAlign: "center",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "20px",
            }}
          >
            <div
              className="glow-pulse"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--emerald)",
                boxShadow: "0 0 10px rgba(0,255,170,0.5)",
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--emerald)" }}>
              System Live
            </span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-tabs { display: none !important; }
          .desktop-status { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
