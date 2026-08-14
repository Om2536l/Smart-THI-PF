import React from "react";
import { pentagonPoints, toPointsAttr, dataPolygon } from "../lib/pentagon.js";

const AXIS_LABELS = ["TSI", "THS", "DRI", "RUL", "APS"];

// Derive five [0,1] "how healthy" values from a unit's raw indices so the
// shape visibly collapses toward the center as condition worsens.
export function indicesToValues(u) {
  return [
    u.tsi,                              // TSI — already 0..1, 1 = stable
    u.ths / 100,                        // THS — 0..100 -> 0..1
    Math.max(0, 1 - u.dri),             // DRI — invert risk into safety
    Math.min(1, u.rul / 30),            // RUL — normalize against 30y design life
    Math.max(0, 1 - u.dri * 0.9),       // APS proxy — action urgency, inverted
  ];
}

export default function HealthSignature({
  values,
  size = 150,
  color = "var(--signal)",
  showLabels = true,
  strokeWidth = 1.6,
}) {
  const pad = showLabels ? size * 0.22 : 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * (showLabels ? 0.32 : 0.42);
  const outer = toPointsAttr(pentagonPoints(cx, cy, r));
  const mid = toPointsAttr(pentagonPoints(cx, cy, r * 0.5));
  const data = dataPolygon(cx, cy, r, values);
  const labelR = r * 1.4;
  const vb = size + pad * 2;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${vb} ${vb}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Health signature: ${AXIS_LABELS.map((l, i) => `${l} ${(values[i] * 100).toFixed(0)}%`).join(", ")}`}
    >
      <polygon points={outer} fill="none" stroke="var(--line)" strokeWidth="1" />
      <polygon points={mid} fill="none" stroke="var(--line)" strokeWidth="1" />
      {pentagonPoints(cx, cy, r).map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />
      ))}
      <polygon points={data} fill={color} fillOpacity="0.22" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      {pentagonPoints(cx, cy, r).map(([x, y], i) => {
        const v = values[i];
        const [px, py] = [
          cx + r * Math.max(0.06, Math.min(1, v)) * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / 5),
          cy + r * Math.max(0.06, Math.min(1, v)) * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / 5),
        ];
        return <circle key={i} cx={px} cy={py} r={2.3} fill={color} />;
      })}
      {showLabels &&
        pentagonPoints(cx, cy, labelR).map(([x, y], i) => (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={i === 0 ? "middle" : x > cx + 2 ? "start" : x < cx - 2 ? "end" : "middle"}
            dominantBaseline="middle"
            fontFamily="var(--font-mono)"
            fontSize={size * 0.075}
            fill="var(--ink-mute)"
          >
            {AXIS_LABELS[i]}
          </text>
        ))}
    </svg>
  );
}

// Compact brand mark: fixed “ideal” outer pentagon + a smaller live-looking
// inner pentagon. Used in the header — same shape language as the data
// radar so the logo IS the five-index framework, not a stock icon.
export function BrandMark({ size = 30 }) {
  const cx = size / 2, cy = size / 2;
  const outer = toPointsAttr(pentagonPoints(cx, cy, size * 0.42));
  const inner = toPointsAttr(pentagonPoints(cx, cy, size * 0.19));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
      <polygon points={outer} fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={inner} fill="var(--signal)" />
    </svg>
  );
}
