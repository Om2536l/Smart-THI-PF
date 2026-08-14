import React, { useState } from "react";
import { Code2, ShieldCheck, BadgeCheck, ChevronDown, Users } from "lucide-react";
import { LOGO_ICON } from "../assets/logo.js";

const TEAM_NAME = "Team Voltrix";
const TEAM = [
  { name: "Om Lasure", initials: "OL" },
  { name: "Sakshi Ranode", initials: "SR" },
  { name: "Nandini Vispute", initials: "NV" },
  { name: "Shailesh Gaikwad", initials: "SG" },
];

const AVATAR_COLORS = ["var(--signal)", "var(--healthy)", "var(--caution)", "var(--critical)"];

export default function Footer() {
  const [teamOpen, setTeamOpen] = useState(false);
  return (
    <footer style={{ position: "relative", overflow: "hidden", background: "var(--surface)", borderTop: "1px solid var(--line)", marginTop: 48 }}>
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--signal), var(--healthy) 50%, var(--signal))" }} />
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        width="360" height="360"
        style={{ position: "absolute", right: -70, bottom: -90, opacity: 0.035, pointerEvents: "none" }}
      >
        <polygon points="100,10 190,75 155,180 45,180 10,75" fill="none" stroke="var(--ink)" strokeWidth="6" />
      </svg>

      <div className="shell footer-grid" style={{ position: "relative", padding: "36px 24px 28px", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 32 }}>
        <div style={{ maxWidth: 360 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ padding: 5, borderRadius: 9, background: "var(--signal-soft)", display: "flex" }}>
              <img src={LOGO_ICON} alt="SMART-THI" style={{ width: 19, height: 27, objectFit: "contain" }} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5 }}>SMART-THI</span>
          </div>
          <p className="mute" style={{ fontSize: 12.5, lineHeight: 1.65 }}>
            A low-cost, five-index transformer health monitoring and closed-loop correction
            system. Department of Electrical Engineering, Sanjivani College of Engineering,
            Kopargaon.
          </p>
          <a
            href="https://github.com/om2536l/Smart-THI"
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 12.5, color: "var(--ink-soft)" }}
          >
            <Code2 size={14} /> View source
          </a>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Project team</div>
          <button
            onClick={() => setTeamOpen((v) => !v)}
            aria-expanded={teamOpen}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              color: "var(--ink)", fontSize: 13, fontFamily: "var(--font-body)",
            }}
          >
            <Users size={15} color="var(--ink-mute)" />
            <span style={{ flex: 1, textAlign: "left" }}>Built by Team Voltrix</span>
            <ChevronDown size={15} color="var(--ink-mute)" style={{ transform: teamOpen ? "rotate(180deg)" : "none", transition: "transform .18s ease" }} />
          </button>

          <div style={{ maxHeight: teamOpen ? 220 : 0, overflow: "hidden", transition: "max-height .25s ease" }}>
            <div style={{ paddingTop: 14 }}>
              <div className="mono" style={{ fontSize: 12, color: "var(--signal)", marginBottom: 10 }}>We are {TEAM_NAME}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {TEAM.map((m, i) => (
                  <li key={m.name} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span
                      className="mono"
                      style={{
                        width: 24, height: 24, borderRadius: "50%", flex: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 600, color: "#fff", background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      }}
                    >
                      {m.initials}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{m.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mute" style={{ fontSize: 12, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <BadgeCheck size={13} /> Guided by Dr. Manoj Saha
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Reference &amp; methodology</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5, color: "var(--ink-soft)" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <ShieldCheck size={13} style={{ marginTop: 2, flex: "none", color: "var(--signal)" }} />
              IEEE Std C57.91 &mdash; thermal-ageing model
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <ShieldCheck size={13} style={{ marginTop: 2, flex: "none", color: "var(--signal)" }} />
              AHP weight derivation, CR &lt; 0.1
            </li>
          </ul>
          <a href="#/methodology" style={{ display: "inline-block", marginTop: 12, fontSize: 12.5, fontWeight: 500 }}>
            Methodology &amp; weight validation &rarr;
          </a>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", position: "relative", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="shell" style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 11.5 }}>
          <span className="mute">Mock data for demonstration &mdash; not live sensor readings</span>
          <span className="mute">&copy; 2026 Team Voltrix</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </footer>
  );
}
