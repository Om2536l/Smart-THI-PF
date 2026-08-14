import React from "react";
import { Zap } from "lucide-react";
import { SUBSTATIONS, STATE_META } from "../data/units.js";

export default function NetworkPage({ units }) {
  return (
    <div className="shell" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <div style={{ marginBottom: 22 }}>
        <h1>Network</h1>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
          Simplified single-line view &mdash; substations, feeders, and every transformer node on them.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {SUBSTATIONS.map((sub) => {
          const feederUnits = sub.feeders.map((f) => ({
            feeder: f,
            units: units.filter((u) => u.feeder === f),
          }));
          return (
            <div key={sub.name} className="card" style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--signal-soft)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Zap size={15} color="var(--signal)" />
                </div>
                <h2>{sub.name}</h2>
              </div>

              <div style={{ height: 1, background: "var(--line-strong)", marginBottom: 4 }} />

              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", paddingTop: 6 }}>
                {feederUnits.map(({ feeder, units: fu }) => (
                  <div key={feeder} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 1, height: 16, background: "var(--line-strong)" }} />
                    <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-soft)", marginBottom: 10, whiteSpace: "nowrap" }}>{feeder}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {fu.map((u) => (
                        <React.Fragment key={u.id}>
                          <div style={{ width: 1, height: 10, background: "var(--line)", alignSelf: "center" }} />
                          <a
                            href={`#/unit/${u.id}`}
                            className="card"
                            style={{
                              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
                              textDecoration: "none", color: "inherit", borderColor: `var(--${u.state})`,
                              minWidth: 132,
                            }}
                          >
                            <span className={`dot dot-${u.state}`} />
                            <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{u.id}</span>
                            <span className="mono mute" style={{ fontSize: 11, marginLeft: "auto" }}>{u.tsi.toFixed(2)}</span>
                          </a>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
