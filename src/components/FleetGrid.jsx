import React, { useMemo, useState } from "react";
import { Search, LayoutGrid, SlidersHorizontal } from "lucide-react";
import UnitCard from "./UnitCard.jsx";

export default function FleetGrid({ units, view, onViewChange }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank = { emergency: 4, critical: 3, warning: 2, caution: 1, healthy: 0 };
    const base = q ? units.filter((u) => u.id.toLowerCase().includes(q) || u.feeder.toLowerCase().includes(q)) : units;
    return [...base].sort((a, b) => rank[b.state] - rank[a.state]);
  }, [units, query]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LayoutGrid size={17} /> Fleet overview
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-mute)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search unit or feeder"
              aria-label="Search unit or feeder"
              style={{
                padding: "7px 10px 7px 30px", fontSize: 13, borderRadius: 8,
                border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)",
                width: 190, fontFamily: "var(--font-body)",
              }}
            />
          </div>
          <div role="group" aria-label="Display mode" className="card" style={{ display: "flex", padding: 3, gap: 2 }}>
            {[
              ["operator", "Operator"],
              ["engineer", "Engineer"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                style={{
                  border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 6, fontSize: 12.5,
                  fontWeight: 500, fontFamily: "var(--font-body)",
                  background: view === key ? "var(--signal)" : "transparent",
                  color: view === key ? "#fff" : "var(--ink-soft)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--ink-mute)", fontSize: 13.5 }}>
          <SlidersHorizontal size={16} style={{ marginBottom: 6 }} />
          <div>No units match &ldquo;{query}&rdquo;.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {filtered.map((u) => <UnitCard key={u.id} unit={u} view={view} />)}
        </div>
      )}
    </div>
  );
}
