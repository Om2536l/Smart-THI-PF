import React from "react";

// Threshold reference bands per metric -- shaded zones matching the
// project's own state-boundary table (Consolidated Guide, Sec 4.6),
// so the chart itself shows what "good" and "bad" mean, not just a
// bare trend line.
const BANDS = {
  tsi: [{ from: 0.8, to: 1.0, color: "var(--healthy)" }, { from: 0, to: 0.2, color: "var(--emergency)" }],
  dri: [{ from: 0.8, to: 1.0, color: "var(--emergency)" }],
  ths: [{ from: 0, to: 40, color: "var(--emergency)" }],
  rul: [],
};

function catmullRomPath(pts) {
  if (pts.length < 3) {
    return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[0];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  return Array.from({ length: count + 1 }, (_, i) => min + i * step);
}

export default function TrendChart({
  points, width = 640, height = 220, unit = "y", color = "var(--signal)", metric = "rul",
}) {
  const pad = { top: 20, right: 20, bottom: 40, left: 52 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const dataMax = Math.max(...points);
  const dataMin = Math.min(...points, 0);
  const headroom = (dataMax - dataMin) * 0.15 || dataMax * 0.15 || 1;
  const max = metric === "rul" ? dataMax + headroom : Math.max(1, dataMax + headroom * 0.3);
  const min = metric === "rul" ? 0 : Math.min(0, dataMin - headroom * 0.3);

  const xAt = (i) => pad.left + (i / (points.length - 1)) * w;
  const yAt = (v) => pad.top + h - ((v - min) / (max - min)) * h;

  const xy = points.map((v, i) => [xAt(i), yAt(v)]);
  const linePath = catmullRomPath(xy);
  const areaPath = `${linePath} L${xy[xy.length - 1][0].toFixed(1)},${pad.top + h} L${xy[0][0].toFixed(1)},${pad.top + h} Z`;

  const yTicks = niceTicks(min, max, 4);
  const xTickIdx = [0, Math.round((points.length - 1) / 3), Math.round((2 * (points.length - 1)) / 3), points.length - 1];
  const bands = (BANDS[metric] || []).map((b) => ({ ...b, y0: yAt(Math.min(b.to, max)), y1: yAt(Math.max(b.from, min)) }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img"
      aria-label={`Trend chart for ${metric.toUpperCase()}, ${points.length} readings, current value ${points[points.length - 1]}${unit}`}>

      {/* Threshold reference bands */}
      {bands.map((b, i) => (
        <rect key={i} x={pad.left} y={Math.min(b.y0, b.y1)} width={w} height={Math.abs(b.y1 - b.y0)}
          fill={b.color} fillOpacity="0.07" />
      ))}

      {/* Gridlines + y-axis ticks */}
      {yTicks.map((t, i) => {
        const y = yAt(t);
        return (
          <g key={i}>
            <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--ink-mute)">
              {metric === "rul" ? t.toFixed(0) : t.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Axis frame */}
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + h} stroke="var(--line-strong)" strokeWidth="1.2" />
      <line x1={pad.left} x2={width - pad.right} y1={pad.top + h} y2={pad.top + h} stroke="var(--line-strong)" strokeWidth="1.2" />

      {/* x-axis ticks */}
      {xTickIdx.map((i, k) => (
        <text key={k} x={xAt(i)} y={pad.top + h + 20} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink-mute)">
          {i === points.length - 1 ? "now" : `t\u2212${points.length - 1 - i}`}
        </text>
      ))}

      {/* Area + smoothed line */}
      <path d={areaPath} fill={color} fillOpacity="0.12" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data point markers */}
      {xy.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === xy.length - 1 ? 4.5 : 2.6}
          fill={i === xy.length - 1 ? color : "var(--surface)"}
          stroke={color} strokeWidth={i === xy.length - 1 ? 0 : 1.6} />
      ))}

      {/* Y-axis label */}
      <text x={14} y={pad.top - 6} fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink-mute)">
        {metric.toUpperCase()}{unit ? ` (${unit})` : ""}
      </text>

      {/* Current-value callout */}
      <text x={xy[xy.length - 1][0]} y={pad.top - 6} textAnchor="end" fontFamily="var(--font-mono)" fontSize="13" fontWeight="600" fill={color}>
        now: {points[points.length - 1]}{unit}
      </text>
    </svg>
  );
}
