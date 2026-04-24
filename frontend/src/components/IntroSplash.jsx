/**
 * module: IntroSplash.jsx
 * purpose: Full-screen cinematic intro — plays once per session.
 *          Scan line → boot text → gold particle convergence →
 *          title reveal → particles fade → enter button.
 * author: HP & Mushan
 */

import { useState, useEffect, useRef, useCallback } from "react";

/** Checks sessionStorage to see if intro already played this session */
function hasPlayedIntro() {
  return sessionStorage.getItem("intro_played") === "true";
}

export default function IntroSplash({ onComplete }) {
  // Phases: boot → particles → title → settled → fade → done
  const [phase, setPhase] = useState("boot");
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const startTimeRef = useRef(null);
  const [particleOpacity, setParticleOpacity] = useState(0);

  // Skip if already played this session
  useEffect(() => {
    if (hasPlayedIntro()) {
      onComplete();
    }
  }, [onComplete]);

  // Phase timeline (slowed down)
  useEffect(() => {
    if (hasPlayedIntro()) return;

    const timers = [];

    // 0.0s → boot phase (text flickers in)
    // 2.2s → particles begin converging
    timers.push(
      setTimeout(() => {
        setPhase("particles");
        setParticleOpacity(1);
      }, 2200),
    );

    // 4.5s → title reveals AND particles start fading immediately
    timers.push(
      setTimeout(() => {
        setPhase("title");
        setParticleOpacity(0);
      }, 4500),
    );

    // 5.8s → particles fully gone, button appears
    timers.push(
      setTimeout(() => {
        setPhase("settled");
      }, 5800),
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  /** User clicks the Enter button */
  const handleEnter = () => {
    setPhase("fade");
    setTimeout(() => {
      sessionStorage.setItem("intro_played", "true");
      onComplete();
    }, 800);
  };

  // Particle system on canvas
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;
    const particles = [];

    for (let i = 0; i < 600; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.max(w, h) * 0.6 + Math.random() * 200;
      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        targetX: cx + (Math.random() - 0.5) * 80,
        targetY: cy + (Math.random() - 0.5) * 30,
        speed: 0.012 + Math.random() * 0.02,
        size: 1 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        hue: Math.random() > 0.3 ? 38 : 0,
      });
    }
    particlesRef.current = particles;
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (phase !== "particles" && phase !== "title" && phase !== "settled")
      return;
    if (phase === "particles") initParticles();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const convergence = Math.min(elapsed / 2.0, 1);

      particlesRef.current.forEach((p) => {
        p.x += (p.targetX - p.x) * p.speed * (1 + convergence * 2);
        p.y += (p.targetY - p.y) * p.speed * (1 + convergence * 2);

        const dist = Math.hypot(p.x - p.targetX, p.y - p.targetY);
        const glow = dist < 20 ? (20 - dist) / 20 : 0;

        const color =
          p.hue === 38
            ? `rgba(245, 158, 11, ${p.alpha * (0.5 + glow * 0.5)})`
            : `rgba(220, 38, 38, ${p.alpha * (0.4 + glow * 0.6)})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + glow * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (glow > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle =
            p.hue === 38
              ? `rgba(245, 158, 11, ${glow * 0.15})`
              : `rgba(220, 38, 38, ${glow * 0.12})`;
          ctx.fill();
        }
      });

      // Center energy flash during convergence
      if (convergence > 0.85 && convergence < 1) {
        const flashAlpha =
          Math.sin(((convergence - 0.85) * Math.PI) / 0.15) * 0.3;
        const cx = w / 2;
        const cy = h / 2;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
        gradient.addColorStop(0, `rgba(220, 38, 38, ${flashAlpha})`);
        gradient.addColorStop(0.4, `rgba(245, 158, 11, ${flashAlpha * 0.5})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, initParticles]);

  if (hasPlayedIntro()) return null;

  const showTitle =
    phase === "title" || phase === "settled" || phase === "fade";
  const showButton = phase === "settled" || phase === "fade";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Scan line */}
      {phase === "boot" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #dc2626, transparent)",
            animation: "scan-sweep 1s ease-out forwards",
          }}
        />
      )}

      {/* Boot text */}
      {phase === "boot" && (
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "12px",
            color: "#dc2626",
            textAlign: "center",
            letterSpacing: "0.08em",
          }}
        >
          <div
            style={{
              animation: "hud-text-in 0.4s ease both",
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            INITIALIZING NEURAL CORE...
          </div>
          <div
            style={{
              animation: "hud-text-in 0.4s ease both",
              animationDelay: "0.9s",
              opacity: 0,
              marginTop: "8px",
            }}
          >
            AGENT SYSTEMS: <span style={{ color: "#f59e0b" }}>ONLINE</span>
          </div>
          <div
            style={{
              animation: "hud-text-in 0.4s ease both",
              animationDelay: "1.4s",
              opacity: 0,
              marginTop: "8px",
            }}
          >
            LINK ESTABLISHED
          </div>
        </div>
      )}

      {/* Particle canvas — fades out after title settles */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: particleOpacity,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* Title + Enter Button */}
      {showTitle && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            animation: "fade-up 1s ease both",
          }}
        >
          <h1
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: 800,
              color: "#f59e0b",
              letterSpacing: "-0.03em",
              textShadow:
                "0 0 40px rgba(245, 158, 11, 0.4), 0 0 80px rgba(220, 38, 38, 0.2)",
              lineHeight: 1.1,
            }}
          >
            GENERAL AGENT
          </h1>
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "clamp(10px, 1.5vw, 14px)",
              color: "rgba(245, 158, 11, 0.7)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "16px",
              animation: "fade-in 0.8s ease 0.4s both",
            }}
          >
            CREATED BY HARISHPRANAV R
          </p>

          {/* Enter button — appears after particles fade out */}
          {showButton && (
            <button
              onClick={handleEnter}
              style={{
                marginTop: "48px",
                padding: "14px 48px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fff",
                background:
                  "linear-gradient(135deg, rgba(220,38,38,0.8), rgba(245,158,11,0.6))",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                cursor: "pointer",
                boxShadow:
                  "0 4px 30px rgba(220,38,38,0.3), 0 0 60px rgba(245,158,11,0.1)",
                transition: "all 0.3s ease",
                animation: "fade-up 0.6s ease both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 40px rgba(220,38,38,0.4), 0 0 80px rgba(245,158,11,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 30px rgba(220,38,38,0.3), 0 0 60px rgba(245,158,11,0.1)";
              }}
            >
              Enter System →
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes scan-sweep {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes hud-text-in {
          0% { opacity: 0; transform: translateX(-6px); filter: blur(2px); }
          30% { opacity: 0.7; transform: translateX(2px); filter: blur(0); }
          50% { opacity: 0.4; transform: translateX(-1px); }
          70% { opacity: 0.9; transform: translateX(0); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
