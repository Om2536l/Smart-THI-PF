// Five axes, evenly spaced starting from the top (like the five indices
// TSI / THS / DRI(safety) / RUL / APS(safety) arranged clockwise).
const AXES = 5;

export function pentagonPoint(cx, cy, r, i) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / AXES;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

export function pentagonPoints(cx, cy, r) {
  return Array.from({ length: AXES }, (_, i) => pentagonPoint(cx, cy, r, i));
}

export function toPointsAttr(pts) {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// values: array of 5 numbers in [0,1], 1 = fully healthy on that axis
export function dataPolygon(cx, cy, r, values) {
  const pts = values.map((v, i) => pentagonPoint(cx, cy, r * Math.max(0.06, Math.min(1, v)), i));
  return toPointsAttr(pts);
}
