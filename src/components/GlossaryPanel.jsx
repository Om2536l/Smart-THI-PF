import React from "react";
import { X } from "lucide-react";

const TERMS = [
  {
    code: "TSI",
    name: "Transformer Stability Index",
    plain: "How steady things are right now \u2014 voltage, current, and temperature all read together.",
    detail: "TSI = 1 \u2212 (weighted voltage, current, temperature, phase-imbalance and load fluctuation). Near 1 = steady. Near 0 = several things fluctuating at once.",
  },
  {
    code: "THS",
    name: "Transformer Health Score",
    plain: "The transformer's long-term condition \u2014 like an odometer for wear, not a speedometer.",
    detail: "Starts at full health and loses points slowly from thermal ageing, faults, and time spent overloaded. Moves over weeks and months, not minutes.",
  },
  {
    code: "DRI",
    name: "Dynamic Risk Index",
    plain: "How likely a failure is if today's conditions keep going.",
    detail: "A rolling average of instability plus recent fault frequency \u2014 reacts faster than THS, slower than TSI.",
  },
  {
    code: "RUL",
    name: "Remaining Useful Life",
    plain: "Roughly how many years of safe insulation life are left.",
    detail: "Calculated from winding temperature using the IEEE Std C57.91 thermal-ageing model \u2014 the real industry standard for insulation ageing, not a guess.",
  },
  {
    code: "APS",
    name: "Action Priority Score",
    plain: "What the system recommends doing about it, ranked by urgency.",
    detail: "Combines DRI, expected improvement, and severity to pick the highest-priority corrective action \u2014 this is the plain-language recommendation shown on every card.",
  },
];

export default function GlossaryPanel({ open, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(10,16,20,0.35)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity .2s ease", zIndex: 40,
        }}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Glossary and guide"
        style={{
          position: "fixed", top: 0, right: 0, height: "100vh", width: "min(420px, 92vw)",
          background: "var(--surface)", borderLeft: "1px solid var(--line)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .25s ease", zIndex: 41,
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
          <div>
            <h2 style={{ fontSize: 17 }}>User manual</h2>
            <p className="mute" style={{ fontSize: 12, marginTop: 3 }}>Plain-language guide to every term on screen</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close user manual"><X size={17} /></button>
        </div>

        <div style={{ overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ padding: "12px 14px", background: "var(--signal-soft)", border: "none" }}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              {"You don't need these definitions to use the dashboard \u2014 every card already tells you what to do in plain words. This panel is here for whenever you want the reasoning behind a number."}
            </p>
          </div>

          {TERMS.map((t) => (
            <div key={t.code}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "var(--signal)" }}>{t.code}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
              </div>
              <p style={{ fontSize: 13.5, marginBottom: 4 }}>{t.plain}</p>
              <p className="mute" style={{ fontSize: 12.5, lineHeight: 1.55 }}>{t.detail}</p>
            </div>
          ))}

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
            <h3 style={{ marginBottom: 6 }}>Status colors</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["healthy", "Running normally, no action needed"],
                ["caution", "Within normal variance, worth noting"],
                ["warning", "Keep watching this shift"],
                ["critical", "Check soon"],
                ["emergency", "Act now \u2014 dispatch a technician"],
              ].map(([s, d]) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                  <span className={`dot dot-${s}`} />
                  <span style={{ textTransform: "capitalize", fontWeight: 500, minWidth: 68 }}>{s}</span>
                  <span className="mute">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
