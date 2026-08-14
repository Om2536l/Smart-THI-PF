import React, { useState } from "react";
import { Zap, RotateCcw, ShieldAlert, Info, Check, FileDown, MapPin, Filter } from "lucide-react";
import { fetchAlerts } from "../data/units.js";
import { downloadWorkOrder } from "../lib/workOrder.js";

const ICON = { correction: Zap, reclose: RotateCcw, trip: ShieldAlert, alert: Info };
const KIND_LABEL = { correction: "Correction", reclose: "Reclose", trip: "Trip", alert: "Alert" };

function ago(mins) {
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h}h ${m}m ago`;
}

export default function AlertsPage({ units, acknowledge, isAcked }) {
  const alerts = fetchAlerts(units);
  const [filter, setFilter] = useState("all");

  const filtered = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "open") return !isAcked(a);
    return a.state === filter;
  });
  const openCount = alerts.filter((a) => !isAcked(a)).length;

  return (
    <div className="shell" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <div style={{ marginBottom: 20 }}>
        <h1>Alert feed</h1>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
          Every autonomous action and threshold crossing across the fleet, newest first.
          {openCount > 0 && <span style={{ color: "var(--critical)", fontWeight: 500 }}> {openCount} unacknowledged.</span>}
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          ["all", "All"],
          ["open", "Unacknowledged"],
          ["emergency", "Emergency"],
          ["critical", "Critical"],
          ["warning", "Warning"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              border: "1px solid var(--line)", borderRadius: 999, padding: "6px 13px",
              fontSize: 12.5, fontFamily: "var(--font-body)", cursor: "pointer",
              background: filter === key ? "var(--signal)" : "var(--surface)",
              color: filter === key ? "#fff" : "var(--ink-soft)",
              borderColor: filter === key ? "var(--signal)" : "var(--line)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 28, textAlign: "center", color: "var(--ink-mute)" }}>
          <Filter size={18} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13.5 }}>No alerts match this filter.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((a, i) => {
            const Icon = ICON[a.kind] ?? Info;
            const acked = isAcked(a);
            const unit = units.find((u) => u.id === a.unitId);
            return (
              <div
                key={i}
                className="card"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
                  opacity: acked ? 0.55 : 1,
                  borderColor: acked ? "var(--line)" : `var(--${a.state})`,
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: `var(--${a.state}-bg)` }}>
                  <Icon size={16} color={`var(--${a.state})`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <a href={`#/unit/${a.unitId}`} className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{a.unitId}</a>
                    <span className="mute" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} />{a.feeder}</span>
                    <span className="eyebrow" style={{ fontSize: 10 }}>{KIND_LABEL[a.kind]}</span>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{a.text}</div>
                  <div className="mono mute" style={{ fontSize: 11, marginTop: 2 }}>{ago(a.minutesAgo)}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flex: "none" }}>
                  {unit && (
                    <button
                      className="icon-btn"
                      title="Generate work order"
                      aria-label={`Generate work order for ${a.unitId}`}
                      onClick={() => downloadWorkOrder(unit, `Alert feed \u2014 ${KIND_LABEL[a.kind]}`)}
                    >
                      <FileDown size={15} />
                    </button>
                  )}
                  <button
                    className="icon-btn"
                    title={acked ? "Acknowledged" : "Acknowledge"}
                    aria-label={acked ? "Already acknowledged" : "Acknowledge this alert"}
                    onClick={() => acknowledge(a)}
                    disabled={acked}
                    style={acked ? { color: "var(--healthy)", borderColor: "var(--healthy)", cursor: "default" } : undefined}
                  >
                    <Check size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
