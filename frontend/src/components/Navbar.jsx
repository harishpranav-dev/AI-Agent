/**
 * module: Navbar.jsx
 * purpose: Sticky frosted navbar — desktop pill tabs + mobile hamburger.
 *          Fully responsive. Glass morphism on dark.
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
          background: "rgba(9, 9, 11, 0.72)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid var(--border-1)",
        }}
      >
        <div
          className="container-main"
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Brand ── */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(124,92,252,0.3)",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "14px", fontWeight: 800 }}
              >
                AI
              </span>
            </div>
            <span
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
              background: "var(--bg-raised)",
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
                    color: active ? "var(--text-0)" : "var(--text-3)",
                    background: active ? "var(--bg-subtle)" : "transparent",
                    border: active
                      ? "1px solid var(--border-2)"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
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
              className="glow-pulse"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--emerald)",
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
            style={{
              display: "none" /* shown via CSS media query */,
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-2)",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              color: "var(--text-1)",
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
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(9,9,11,0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            paddingTop: "60px",
          }}
        >
          {tabs.map((tab) => {
            const active = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "14px 48px",
                  borderRadius: "var(--r-md)",
                  fontSize: "16px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--accent)" : "var(--text-2)",
                  background: active ? "var(--accent-soft)" : "transparent",
                  border: active
                    ? "1px solid var(--accent-border)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  width: "240px",
                  textAlign: "center",
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
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--emerald)" }}>
              System Live
            </span>
          </div>
        </div>
      )}

      {/* ── Responsive CSS ── */}
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
