import React from "react";
import { Radio, Brain, GitBranch, Zap, RefreshCw } from "lucide-react";

const STAGES = [
  { key: "sense", label: "Sense", icon: Radio, desc: "Voltage, current, temperature, humidity" },
  { key: "understand", label: "Understand", icon: Brain, desc: "TSI, THS, DRI, RUL computed" },
  { key: "decide", label: "Decide", icon: GitBranch, desc: "APS ranks candidate actions" },
  { key: "act", label: "Act", icon: Zap, desc: "Correction or trip-reclose executed" },
  { key: "learn", label: "Learn", icon: RefreshCw, desc: "Outcome fed back into APS weights" },
];

export default function SignalFlow({ activeKey }) {
  return (
    <div style={{ display: "flex", overflowX: "auto", gap: 0, paddingBottom: 4 }}>
      {STAGES.map((s, i) => {
        const active = s.key === activeKey;
        const Icon = s.icon;
        return (
          <React.Fragment key={s.key}>
            <div style={{ flex: "1 1 100px", minWidth: 88, maxWidth: 128, textAlign: "center" }}>
              <div
                style={{
                  width: 50, height: 50, margin: "0 auto 8px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? "var(--signal)" : "var(--bg)",
                  border: active ? "none" : "1px solid var(--line)",
                }}
              >
                <Icon size={22} color={active ? "#fff" : "var(--ink-mute)"} />
              </div>
              <div style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? "var(--ink)" : "var(--ink-soft)" }}>{s.label}</div>
              <div className="mute" style={{ fontSize: 12, marginTop: 3, lineHeight: 1.4 }}>{s.desc}</div>
            </div>
            {i < STAGES.length - 1 && (
              <div style={{ flex: "0 1 24px", minWidth: 12, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", height: 1, background: "var(--line)" }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
