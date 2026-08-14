import React from "react";

export default function WeightComparison({ weights }) {
  const max = Math.max(...weights.flatMap((w) => [w.ahp, w.empirical])) * 1.15;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {weights.map((w) => (
        <div key={w.key}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
            <span><span className="mono" style={{ color: "var(--signal)", marginRight: 6 }}>{w.key}</span>{w.label}</span>
          </div>
          {[
            ["AHP", w.ahp, "var(--signal)"],
            ["Empirical", w.empirical, "var(--healthy)"],
          ].map(([label, v, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="mute" style={{ fontSize: 11, width: 62, flex: "none" }}>{label}</span>
              <div style={{ flex: 1, background: "var(--bg)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(v / max) * 100}%`, height: "100%", background: color, borderRadius: 4 }} />
              </div>
              <span className="mono" style={{ fontSize: 11.5, width: 40, textAlign: "right", flex: "none" }}>{v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
