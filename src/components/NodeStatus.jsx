import React from "react";
import { Wifi, WifiOff, Clock, Cpu } from "lucide-react";

function SignalBars({ bars }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 3.5, height: 3 + i * 2.2, borderRadius: 1,
            background: i <= bars ? "var(--healthy)" : "var(--line-strong)",
          }}
        />
      ))}
    </div>
  );
}

export default function NodeStatus({ node }) {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2>Node connectivity</h2>
        <span
          className="pill"
          style={{
            background: node.online ? "var(--healthy-bg)" : "var(--emergency-bg)",
            color: node.online ? "var(--healthy)" : "var(--emergency)",
          }}
        >
          {node.online ? "Reporting" : "Offline"}
        </span>
      </div>
      <p className="mute" style={{ fontSize: 12, marginBottom: 16 }}>
        The ESP32 node's own health &mdash; separate from the transformer it's monitoring.
        A quiet node isn't the same as a healthy transformer.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            {node.online ? <Wifi size={12} /> : <WifiOff size={12} />} Signal
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SignalBars bars={node.signalBars} />
            <span className="mono" style={{ fontSize: 12.5 }}>{node.rssi} dBm</span>
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={12} /> Last seen
          </div>
          <div className="mono" style={{ fontSize: 12.5 }}>{node.lastSeenMin}m ago</div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Uptime</div>
          <div className="mono" style={{ fontSize: 12.5 }}>{node.uptimeDays} days</div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <Cpu size={12} /> Firmware
          </div>
          <div className="mono" style={{ fontSize: 12.5 }}>v{node.firmware}</div>
        </div>
      </div>
    </div>
  );
}
