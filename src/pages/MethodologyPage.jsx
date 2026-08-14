import React from "react";
import { ArrowLeft } from "lucide-react";
import { WEIGHTS, CONSISTENCY_RATIO, THRESHOLDS, STATE_META } from "../data/units.js";
import WeightComparison from "../components/WeightComparison.jsx";

export default function MethodologyPage() {
  return (
    <div className="shell" style={{ paddingTop: 24, paddingBottom: 48, maxWidth: 760 }}>
      <a href="#/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, marginBottom: 18 }}>
        <ArrowLeft size={15} /> Back to fleet
      </a>

      <h1 style={{ marginBottom: 8 }}>Methodology</h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Index weights are derived two independent ways &mdash; Analytic Hierarchy Process (AHP) pairwise comparison,
        and an empirical logistic-regression fit against staged degradation testing &mdash; rather than one
        arbitrary guess, which is the field's most common unresolved weakness.
      </p>

      <div className="card" style={{ padding: "16px 18px", marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Consistency ratio</div>
          <div className="mono" style={{ fontSize: 22 }}>{CONSISTENCY_RATIO.toFixed(3)}</div>
          <div className="mute" style={{ fontSize: 11.5, marginTop: 2 }}>Accepted &mdash; below the 0.1 threshold</div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Method agreement</div>
          <div className="mono" style={{ fontSize: 22 }}>Strong</div>
          <div className="mute" style={{ fontSize: 11.5, marginTop: 2 }}>Cosine similarity across weight vectors</div>
        </div>
      </div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: 20 }}>
        <h2 style={{ marginBottom: 6 }}>State thresholds</h2>
        <p className="mute" style={{ fontSize: 12.5, marginBottom: 14 }}>
          The decision engine's five states, jointly determined by TSI and DRI &mdash; literature-informed
          starting points, tuned against staged-testing data, not hardcoded assumptions.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {THRESHOLDS.map((t) => (
            <div key={t.state} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 8, background: "var(--bg)" }}>
              <span className={`pill pill-${t.state}`} style={{ flex: "none", width: 88, textAlign: "center" }}>{STATE_META[t.state].label}</span>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{t.condition}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: 20 }}>
        <h2 style={{ marginBottom: 16 }}>AHP vs empirical weights</h2>
        <WeightComparison weights={WEIGHTS} />
      </div>

      <div className="card" style={{ padding: "18px 20px" }}>
        <h2 style={{ marginBottom: 10 }}>Safety scope</h2>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.9 }}>
          <li>Validated on a supervised lab bench &mdash; never live 11kV/33kV mains.</li>
          <li>Relay bank rated and tested only at bench voltage &mdash; a logic demonstrator, not deployment-ready switchgear.</li>
          <li>Fault conditions are simulated or induced under controlled, supervised conditions only.</li>
          <li>Relay switching is rate-limited in firmware to avoid wear or chatter.</li>
        </ul>
      </div>
    </div>
  );
}
