/**
 * module: App.jsx
 * purpose: Root layout with ambient background, router, navbar, footer.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SingleAgent from "./pages/SingleAgent";
import MultiAgent from "./pages/MultiAgent";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          background: "var(--bg-base)",
        }}
      >
        {/* ── Ambient light orbs ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-15%",
              left: "45%",
              width: "700px",
              height: "500px",
              background:
                "radial-gradient(ellipse, rgba(124,92,252,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "-5%",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: "-5%",
              width: "350px",
              height: "350px",
              background:
                "radial-gradient(circle, rgba(56,189,248,0.03) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        {/* ── Grain overlay ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.015,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
          <footer
            style={{
              textAlign: "center",
              padding: "24px 20px",
              borderTop: "1px solid var(--border-0)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-4)",
                letterSpacing: "0.03em",
              }}
            >
              - Built by HARISHPRANAV R [24BSC022]
            </p>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
