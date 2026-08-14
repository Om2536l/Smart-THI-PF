import React, { useState } from "react";
import { FileDown } from "lucide-react";
import PriorityQueue from "../components/PriorityQueue.jsx";
import KpiStrip from "../components/KpiStrip.jsx";
import FleetGrid from "../components/FleetGrid.jsx";
import PrintHeader from "../components/PrintHeader.jsx";

export default function FleetPage({ units }) {
  const [view, setView] = useState("operator");
  return (
    <div className="shell" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <PrintHeader subtitle="Fleet report" />
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Fleet overview</h1>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Kopargaon &amp; neighbouring feeders, Maharashtra</p>
        </div>
        <button className="btn no-print" onClick={() => window.print()}>
          <FileDown size={14} /> Download report
        </button>
      </div>
      <PriorityQueue units={units} />
      <KpiStrip units={units} />
      <FleetGrid units={units} view={view} onViewChange={setView} />
    </div>
  );
}
