/**
 * module: TaskResult.jsx
 * purpose: Displays the final markdown report — Iron HUD theme.
 * author: HP & Mushan
 */

import React, { useState } from "react";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function simpleMarkdown(text) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("### "))
        return `<h3 style="color:var(--text-0);font-size:14px;font-weight:700;margin:16px 0 6px;">${escapeHtml(line.slice(4))}</h3>`;
      if (line.startsWith("## "))
        return `<h2 style="color:var(--text-0);font-size:16px;font-weight:700;margin:20px 0 8px;">${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith("# "))
        return `<h1 style="color:var(--gold);font-size:18px;font-weight:800;margin:20px 0 10px;">${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith("- ") || line.startsWith("* "))
        return `<div style="display:flex;gap:8px;margin:3px 0;"><span style="color:var(--red);">•</span><span>${escapeHtml(line.slice(2))}</span></div>`;
      if (line.trim() === "") return '<div style="height:8px;"></div>';
      return `<p style="margin:4px 0;line-height:1.65;">${escapeHtml(line)}</p>`;
    })
    .join("")
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="color:var(--text-0);font-weight:600;">$1</strong>',
    );
}

export default function TaskResult({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (!result) {
    return (
      <div
        className="glass-card-heavy glass-shine"
        style={{ padding: "48px 24px", textAlign: "center" }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.2 }}>
          📄
        </div>
        <p
          className="font-mono"
          style={{
            color: "var(--text-4)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Agent report will appear here
        </p>
        <div
          style={{
            width: "40px",
            height: "2px",
            borderRadius: "2px",
            background: "var(--border-1)",
            margin: "14px auto 0",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="glass-card-heavy hud-corners"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="hud-corners-bottom"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-0)",
        }}
      >
        {/* Red→Gold gradient accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #dc2626, #f59e0b, #ef4444)",
            opacity: 0.5,
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="font-mono"
            style={{
              color: "var(--red)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Agent Report
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="btn-press font-mono"
          style={{
            padding: "5px 14px",
            borderRadius: "var(--r-sm)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: copied ? "var(--emerald)" : "var(--text-2)",
            background: copied ? "var(--emerald-soft)" : "var(--bg-subtle)",
            border: `1px solid ${copied ? "var(--emerald-border)" : "var(--border-2)"}`,
            cursor: "pointer",
            transition: "all 0.25s ease",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div
        style={{
          padding: "20px",
          maxHeight: "500px",
          overflowY: "auto",
          color: "var(--text-2)",
          fontSize: "13.5px",
          lineHeight: 1.65,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.06) transparent",
        }}
        dangerouslySetInnerHTML={{ __html: simpleMarkdown(result) }}
      />
    </div>
  );
}
