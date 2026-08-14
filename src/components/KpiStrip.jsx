import React from "react";
import { STATE_META } from "../data/units.js";

export default function KpiStrip({ units }) {
  const avgTsi = units.reduce((s, u) => s + u.tsi, 0) / units.length;
  const avgRul = units.reduce((s, u) => s + u.rul, 0) / units.length;
  const actionsToday = units.reduce((s, u) => s + u.events.filter((e) => e.kind === "correction" || e.kind === "reclose" || e.kind === "trip").length, 0);
  const counts = Object.keys(STATE_META).reduce((acc, s) => ({ ...acc, [s]: units.filter((u) => u.state === s).length }), {});
  const reliabilityScore = { healthy: 100, caution: 88, warning: 65, critical: 35, emergency: 5 };
  const reliabilityIndex = units.reduce((s, u) => s + (reliabilityScore[u.state] ?? 50), 0) / units.length;

  const metrics = [
    { label: "Fleet units", value: units.length },
    { label: "Avg stability (TSI)", value: avgTsi.toFixed(2) },
    { label: "Avg life remaining", value: `${avgRul.toFixed(1)}y` },
    { label: "Autonomous actions today", value: actionsToday },
    { label: "Fleet reliability index", value: `${reliabilityIndex.toFixed(0)}%` },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 22 }}>
      {metrics.map((m) => (
        <div key={m.label} className="card" style={{ padding: "14px 16px" }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{m.label}</div>
          <div className="mono" style={{ fontSize: 30, fontWeight: 500 }}>{m.value}</div>
        </div>
      ))}
      <div className="card" style={{ padding: "14px 16px", gridColumn: "span 1" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>By status</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(counts).filter(([, c]) => c > 0).map(([s, c]) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
              <span className={`dot dot-${s}`} />
              <span className="mono">{c}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
