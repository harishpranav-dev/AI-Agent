/**
 * module: TaskResult.jsx
 * purpose: Displays the final markdown report produced by the Writer agent.
 *          Renders basic markdown (headers, bold, lists) as styled HTML.
 *          Includes a copy-to-clipboard button and scrollable content area.
 * author: HP & Mushan
 */

import React, { useState } from "react";

/**
 * simpleMarkdown — converts basic markdown syntax to HTML.
 * Handles: h1-h3, bold, bullet lists, and paragraphs.
 * This is a lightweight renderer — no external library needed.
 */
function simpleMarkdown(text) {
  if (!text) return "";

  return (
    text
      .split("\n")
      .map((line) => {
        // Headers
        if (line.startsWith("### "))
          return `<h3 style="color:var(--text-0);font-size:14px;font-weight:700;margin:16px 0 6px;">${line.slice(4)}</h3>`;
        if (line.startsWith("## "))
          return `<h2 style="color:var(--text-0);font-size:16px;font-weight:700;margin:20px 0 8px;">${line.slice(3)}</h2>`;
        if (line.startsWith("# "))
          return `<h1 style="color:var(--text-0);font-size:18px;font-weight:800;margin:20px 0 10px;">${line.slice(2)}</h1>`;
        // Bullet lists
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<div style="display:flex;gap:8px;margin:3px 0;"><span style="color:var(--accent);">•</span><span>${line.slice(2)}</span></div>`;
        }
        // Empty lines → spacer
        if (line.trim() === "") return '<div style="height:8px;"></div>';
        // Regular paragraph
        return `<p style="margin:4px 0;line-height:1.65;">${line}</p>`;
      })
      .join("")
      // Bold text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color:var(--text-0);font-weight:600;">$1</strong>',
      )
  );
}

/**
 * TaskResult — displays the final report from the Writer agent.
 *
 * Props:
 *   result — markdown string of the completed report (or null if not ready)
 */
export default function TaskResult({ result }) {
  const [copied, setCopied] = useState(false);

  /** Copies the raw markdown text to clipboard */
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
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border-1)",
          borderRadius: "var(--r-lg)",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "10px", opacity: 0.4 }}>
          📄
        </div>
        <p style={{ color: "var(--text-4)", fontSize: "13px" }}>
          Agent report will appear here once complete
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--r-lg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with copy button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-0)",
        }}
      >
        <span
          style={{
            color: "var(--text-1)",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          📋 Agent Report
        </span>

        <button
          onClick={handleCopy}
          style={{
            padding: "5px 12px",
            borderRadius: "var(--r-sm)",
            fontSize: "11px",
            fontWeight: 600,
            color: copied ? "var(--emerald)" : "var(--text-2)",
            background: copied ? "var(--emerald-soft)" : "var(--bg-subtle)",
            border: `1px solid ${copied ? "rgba(34,197,94,0.2)" : "var(--border-2)"}`,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Scrollable report content */}
      <div
        style={{
          padding: "18px",
          maxHeight: "500px",
          overflowY: "auto",
          color: "var(--text-2)",
          fontSize: "13.5px",
          lineHeight: 1.65,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--bg-muted) transparent",
        }}
        dangerouslySetInnerHTML={{ __html: simpleMarkdown(result) }}
      />
    </div>
  );
}
