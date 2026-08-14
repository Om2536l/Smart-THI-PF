import React from "react";

export default function PhaseBars({ phase, height = 52, compact = false }) {
  const [r, y, b] = phase;
  const max = Math.max(r, y, b, 1) * 1.15;
  const avg = (r + y + b) / 3;
  const imbalance = (Math.max(Math.abs(r - avg), Math.abs(y - avg), Math.abs(b - avg)) / avg) * 100;
  const bars = [
    { label: "R", v: r, color: "var(--phase-r)" },
    { label: "Y", v: y, color: "var(--phase-y)" },
    { label: "B", v: b, color: "var(--phase-b)" },
  ];

  return (
    <div>
      {!compact && <div className="eyebrow" style={{ marginBottom: 8 }}>Three-phase current (A)</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height }}>
        {bars.map((bar) => (
          <div key={bar.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              title={`${bar.label}: ${bar.v} A`}
              style={{
                width: compact ? 12 : 22,
                height: Math.max(4, (bar.v / max) * height),
                background: bar.color,
                borderRadius: "3px 3px 0 0",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mono" style={{ display: "flex", gap: 16, fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>
        <span>R {r}</span>
        <span>Y {y}</span>
        <span>B {b}</span>
      </div>
      {!compact && (
        <div className="mono" style={{ fontSize: 12.5, marginTop: 5, color: imbalance > 15 ? "var(--critical)" : "var(--ink-mute)" }}>
          Imbalance {imbalance.toFixed(0)}%
        </div>
      )}
    </div>
  );
}
