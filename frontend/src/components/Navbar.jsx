/**
 * module: Navbar.jsx
 * purpose: HUD-style sticky navbar with targeting reticle corners,
 *          red/gold accent system, desktop tabs + mobile hamburger.
 * author: HP & Mushan
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
        className="hud-corners"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "saturate(180%) blur(28px)",
          WebkitBackdropFilter: "saturate(180%) blur(28px)",
          borderBottom: "1px solid rgba(220, 38, 38, 0.1)",
        }}
      >
        {/* Top red shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "3%",
            right: "3%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(220,38,38,0.25), rgba(245,158,11,0.15), rgba(220,38,38,0.15), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Bottom corners pseudo */}
        <div
          className="hud-corners-bottom"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
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
                borderRadius: "6px",
                background: "var(--grad-primary)",
                backgroundSize: "200% 200%",
                animation: "gradient-flow 4s ease infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 2px 20px rgba(220,38,38,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <span
                className="font-mono"
                style={{
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
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
              General Agent
            </span>
          </Link>

          {/* ── Desktop Tabs ── */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              padding: "4px",
              borderRadius: "10px",
              background: "rgba(10,10,10,0.6)",
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
                    borderRadius: "7px",
                    fontSize: "13px",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--red)" : "var(--text-3)",
                    background: active ? "var(--red-soft)" : "transparent",
                    border: active
                      ? "1px solid var(--red-border)"
                      : "1px solid transparent",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: active ? "0 0 12px rgba(220,38,38,0.1)" : "none",
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

          {/* ── System Status (desktop) ── */}
          <div
            className="desktop-status font-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px 4px 8px",
              borderRadius: "var(--r-full)",
              background: "rgba(34, 197, 94, 0.06)",
              border: "1px solid rgba(34, 197, 94, 0.15)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--emerald)",
                boxShadow: "0 0 10px rgba(34,197,94,0.5)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--emerald)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Systems Online
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
            background: "rgba(0,0,0,0.95)",
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
                  color: active ? "var(--red)" : "var(--text-2)",
                  background: active ? "var(--red-soft)" : "transparent",
                  border: active
                    ? "1px solid var(--red-border)"
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
            className="font-mono"
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
                boxShadow: "0 0 10px rgba(34,197,94,0.5)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                color: "var(--emerald)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Systems Online
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
