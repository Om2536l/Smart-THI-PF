import React from "react";

export default function PrintHeader({ subtitle }) {
  const date = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  return (
    <div className="print-only" style={{ marginBottom: 20, paddingBottom: 14, borderBottom: "2px solid #101B22" }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>SMART-THI</div>
      <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{subtitle}</div>
      <div style={{ fontSize: 11, color: "#777", marginTop: 6 }}>
        Generated {date} &middot; Mock data for demonstration, not live sensor readings
      </div>
    </div>
  );
}
