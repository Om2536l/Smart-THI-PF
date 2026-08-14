import React, { useEffect, useRef, useState } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { STATE_META } from "../data/units.js";
import HealthSignature, { indicesToValues } from "./HealthSignature.jsx";
import PhaseBars from "./PhaseBars.jsx";

export default function UnitCard({ unit, view }) {
  const prevState = useRef(unit.state);
  const [flash, setFlash] = useState(null); // "up" | "down" | null

  useEffect(() => {
    if (prevState.current !== unit.state) {
      const rank = { emergency: 4, critical: 3, warning: 2, caution: 1, healthy: 0 };
      setFlash(rank[unit.state] > rank[prevState.current] ? "up" : "down");
      prevState.current = unit.state;
      const t = setTimeout(() => setFlash(null), 2600);
      return () => clearTimeout(t);
    }
  }, [unit.state]);

  const flashColor = flash === "up" ? "var(--critical)" : flash === "down" ? "var(--healthy)" : null;

  return (
    <a
      href={`#/unit/${unit.id}`}
      className="card"
      style={{
        display: "block", padding: "16px 18px", textDecoration: "none", color: "inherit",
        transition: "box-shadow .6s ease, border-color .6s ease",
        boxShadow: flashColor ? `0 0 0 2px ${flashColor}, var(--shadow-raised, var(--shadow-card))` : undefined,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{unit.id}</div>
          <div className="mute" style={{ fontSize: 13.5, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <MapPin size={12} />{unit.feeder}
          </div>
        </div>
        <span className={`pill pill-${unit.state}`}>{STATE_META[unit.state].label}</span>
      </div>

      {view === "operator" ? (
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", minHeight: 40 }}>{unit.aps}</p>
      ) : (
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <HealthSignature values={indicesToValues(unit)} size={92} showLabels={false} color={`var(--${unit.state})`} />
          <PhaseBars phase={unit.phase} height={40} compact />
        </div>
      )}

      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "var(--ink-mute)", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
        <span>TSI {unit.tsi.toFixed(2)}</span>
        <span>RUL {unit.rul}y</span>
        <span style={{ display: "flex", alignItems: "center", gap: 2, color: "var(--signal)" }}>
          Details <ChevronRight size={13} />
        </span>
      </div>
    </a>
  );
}
