/**
 * module: TypingPlaceholder.jsx
 * purpose: Animated placeholder that types/deletes cycling suggestions
 *          in a textarea, bolt.new style. Stops on focus.
 * author: HP & Mushan
 */

import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_SUGGESTIONS = [
  "Research the latest developments in quantum computing...",
  "Analyze the global impact of AI on employment...",
  "Compare Python and JavaScript for web development...",
  "Write a brief history of artificial intelligence...",
  "Investigate renewable energy trends for 2025...",
];

export default function TypingPlaceholder({
  suggestions = DEFAULT_SUGGESTIONS,
  value,
  onChange,
  onKeyDown,
  disabled = false,
  rows = 3,
}) {
  const [displayText, setDisplayText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const directionRef = useRef("typing"); // typing | holding | deleting
  const timerRef = useRef(null);

  const tick = useCallback(() => {
    if (isFocused || disabled || value) return;

    const currentSuggestion = suggestions[indexRef.current];
    const dir = directionRef.current;

    if (dir === "typing") {
      charRef.current++;
      setDisplayText(currentSuggestion.slice(0, charRef.current));

      if (charRef.current >= currentSuggestion.length) {
        directionRef.current = "holding";
        timerRef.current = setTimeout(tick, 2000); // hold for 2s
        return;
      }
      timerRef.current = setTimeout(tick, 35); // fast typing
    } else if (dir === "holding") {
      directionRef.current = "deleting";
      timerRef.current = setTimeout(tick, 20);
    } else if (dir === "deleting") {
      charRef.current--;
      setDisplayText(currentSuggestion.slice(0, charRef.current));

      if (charRef.current <= 0) {
        directionRef.current = "typing";
        indexRef.current = (indexRef.current + 1) % suggestions.length;
        timerRef.current = setTimeout(tick, 400); // pause before next
        return;
      }
      timerRef.current = setTimeout(tick, 18); // fast delete
    }
  }, [isFocused, disabled, value, suggestions]);

  useEffect(() => {
    if (!isFocused && !value && !disabled) {
      timerRef.current = setTimeout(tick, 600);
    }
    return () => clearTimeout(timerRef.current);
  }, [tick, isFocused, value, disabled]);

  // Clear animation text when focused or has value
  useEffect(() => {
    if (isFocused || value) {
      clearTimeout(timerRef.current);
    }
  }, [isFocused, value]);

  const showAnimation = !isFocused && !value && !disabled;

  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-card)",
        borderRadius: "var(--r-md)",
      }}
    >
      {/* Animated placeholder overlay */}
      {showAnimation && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: "12px 16px",
            color: "var(--text-4)",
            fontSize: "14px",
            lineHeight: 1.6,
            pointerEvents: "none",
            zIndex: 3,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <span>{displayText}</span>
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "18px",
              background: "var(--red)",
              marginLeft: "1px",
              animation: "cursor-blink 1s step-end infinite",
              flexShrink: 0,
            }}
          />
        </div>
      )}

      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          if (!value) {
            // Restart animation
            charRef.current = 0;
            directionRef.current = "typing";
            setDisplayText("");
          }
        }}
        disabled={disabled}
        rows={rows}
        placeholder=""
        style={{
          width: "100%",
          background: "var(--bg-card)",
          border: "1px solid var(--border-2)",
          borderRadius: "var(--r-md)",
          padding: "12px 16px",
          color: "var(--text-0)",
          fontSize: "14px",
          resize: "none",
          outline: "none",
          fontFamily: "inherit",
          lineHeight: 1.6,
          opacity: disabled ? 0.5 : 1,
          boxSizing: "border-box",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
          position: "relative",
          zIndex: 2,
          // transparent bg when showing animation overlay
          ...(showAnimation
            ? {
                background: "transparent",
                color: "transparent",
                caretColor: "transparent",
              }
            : {}),
        }}
      />

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
