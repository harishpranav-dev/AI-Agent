/**
 * module: App.jsx
 * purpose: Root layout — intro splash, animated HUD background, router, navbar, footer.
 * author: HP & Mushan
 */

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IntroSplash from "./components/IntroSplash";
import Home from "./pages/Home";
import SingleAgent from "./pages/SingleAgent";
import MultiAgent from "./pages/MultiAgent";
import History from "./pages/History";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <BrowserRouter>
      {/* ── Cinematic Intro ── */}
      {!introComplete && (
        <IntroSplash onComplete={() => setIntroComplete(true)} />
      )}

      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          background: "var(--bg-base)",
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* ── Animated grid background ── */}
        <div className="animated-grid" />

        {/* ── Red/Gold ambient orbs ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {/* Primary red orb — top center */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "40%",
              width: "800px",
              height: "600px",
              background:
                "radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, rgba(220,38,38,0.02) 40%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orb-float-1 20s ease-in-out infinite",
            }}
          />
          {/* Gold orb — bottom left */}
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "-8%",
              width: "500px",
              height: "500px",
              background:
                "radial-gradient(circle, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.02) 40%, transparent 65%)",
              filter: "blur(50px)",
              animation: "orb-float-2 25s ease-in-out infinite",
            }}
          />
          {/* Red orb — right side */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              right: "-6%",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 60%)",
              filter: "blur(50px)",
              animation: "orb-float-1 30s ease-in-out infinite reverse",
            }}
          />
          {/* Subtle gold orb — mid */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "25%",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(245,158,11,0.025) 0%, transparent 60%)",
              filter: "blur(40px)",
              animation: "orb-float-2 18s ease-in-out infinite",
            }}
          />
        </div>

        {/* ── Noise/grain overlay ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.015,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Content ── */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar />
          <main
            className="container-main"
            style={{ paddingTop: "32px", paddingBottom: "80px" }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/single" element={<SingleAgent />} />
              <Route path="/multi" element={<MultiAgent />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>

          {/* ── Footer ── */}
          <footer
            style={{
              textAlign: "center",
              padding: "28px 20px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(220,38,38,0.15), rgba(245,158,11,0.1), transparent)",
              }}
            />
            <p
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "var(--text-4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Built by HARISHPRANAV R [24BSC022]
            </p>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
