import React from "react";
import { AlertTriangle, AlertCircle, Eye, CheckCircle2, MapPin, ChevronRight } from "lucide-react";
import { STATE_META } from "../data/units.js";

const ICON = { emergency: AlertTriangle, critical: AlertCircle, warning: Eye };

export default function PriorityQueue({ units }) {
  const attention = units.filter((u) => ["emergency", "critical", "warning"].includes(u.state));
  const calmCount = units.length - attention.length;

  if (attention.length === 0) {
    return (
      <div className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <CheckCircle2 size={20} color="var(--healthy)" />
        <span style={{ fontSize: 15 }}>All {units.length} units running normally.</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Needs attention &middot; sorted by priority</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {attention.map((u) => {
          const Icon = ICON[u.state];
          const glowClass = u.state === "emergency" ? "glow-emergency" : u.state === "critical" ? "glow-critical" : "";
          return (
            <a
              key={u.id}
              href={`#/unit/${u.id}`}
              className={`card ${glowClass}`}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: "15px 18px",
                textDecoration: "none", color: "inherit", flexWrap: "wrap",
                borderColor: `var(--${u.state})`,
              }}
            >
              <Icon size={22} color={`var(--${u.state})`} style={{ flex: "none" }} />
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <span className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{u.id}</span>
                  <span className="mute" style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 3 }}>
                    <MapPin size={13} />{u.feeder}
                  </span>
                  <span className={`pill pill-${u.state}`}>{STATE_META[u.state].label}</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>{u.aps}</div>
              </div>
              <div className="mono mute" style={{ fontSize: 13, textAlign: "right", flex: "none" }}>
                TSI {u.tsi.toFixed(2)} &middot; RUL {u.rul}y
              </div>
              <ChevronRight size={18} className="mute" style={{ flex: "none" }} />
            </a>
          );
        })}
      </div>
      {calmCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 4px", color: "var(--ink-soft)", fontSize: 14 }}>
          <CheckCircle2 size={16} color="var(--healthy)" />
          {calmCount} other unit{calmCount !== 1 ? "s" : ""} running normally
        </div>
      )}
    </div>
  );
}
