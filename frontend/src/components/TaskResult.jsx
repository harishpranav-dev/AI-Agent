/**
 * module: TaskResult.jsx
 * purpose: Displays the final markdown report produced by the Writer agent.
 * author: HP & Mushan
 */

import React, { useState } from "react";

function simpleMarkdown(text) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("### "))
        return `<h3 style="color:var(--text-0);font-size:14px;font-weight:700;margin:16px 0 6px;">${line.slice(4)}</h3>`;
      if (line.startsWith("## "))
        return `<h2 style="color:var(--text-0);font-size:16px;font-weight:700;margin:20px 0 8px;">${line.slice(3)}</h2>`;
      if (line.startsWith("# "))
        return `<h1 style="color:var(--text-0);font-size:18px;font-weight:800;margin:20px 0 10px;">${line.slice(2)}</h1>`;
      if (line.startsWith("- ") || line.startsWith("* "))
        return `<div style="display:flex;gap:8px;margin:3px 0;"><span style="color:var(--neon);">•</span><span>${line.slice(2)}</span></div>`;
      if (line.trim() === "") return '<div style="height:8px;"></div>';
      return `<p style="margin:4px 0;line-height:1.65;">${line}</p>`;
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
        <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.25 }}>
          📄
        </div>
        <p
          style={{ color: "var(--text-4)", fontSize: "13px", lineHeight: 1.5 }}
        >
          Agent report will appear here once complete
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
      className="glass-card-heavy"
      style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, #7B61FF, #00D4FF, #00ffaa, #ffb800)",
            opacity: 0.5,
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>📋</span>
          <span
            className="font-display"
            style={{
              color: "var(--text-1)",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Agent Report
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="btn-press"
          style={{
            padding: "5px 14px",
            borderRadius: "var(--r-sm)",
            fontSize: "11px",
            fontWeight: 600,
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
          {copied ? (
            <>
              <span style={{ fontSize: "11px" }}>✓</span>Copied
            </>
          ) : (
            "Copy"
          )}
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
