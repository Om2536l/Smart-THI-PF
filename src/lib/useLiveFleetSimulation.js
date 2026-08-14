import { useEffect, useMemo, useRef, useState } from "react";

// Fleet-wide "reading is happening right now" simulation. Every unit's
// TSI/DRI and three-phase currents wobble live for SIM_TICKS ticks
// (SIM_TICKS * TICK_MS = ~2 minutes). On top of that ambient drift, two
// scripted arcs run against real units in the mock fleet -- one recovering
// (Critical -> Healthy) and one degrading (Healthy -> Critical) -- so the
// priority queue and fleet grid visibly reorder as it plays out, not just
// the numbers. A handful of the most dramatic transitions also surface as
// toast notifications; everything else stays in the event log only, so
// pop-ups stay rare and meaningful instead of constant noise.

const TICK_MS = 2000;
const SIM_TICKS = 60; // 60 * 2s = 120s = 2 minutes

const AMBIENT_POOL = {
  low: [
    "Routine telemetry check \u2014 all parameters nominal.",
    "Sensor calibration heartbeat received.",
    "Decision engine cycle completed \u2014 no action generated.",
  ],
  mid: [
    "Load variation observed above baseline.",
    "Minor imbalance observed, within tolerance.",
  ],
  high: [
    "Threshold review triggered \u2014 monitoring closely.",
    "Phase correction executed \u2014 severity reduced.",
  ],
};

// Scripted state-transition arcs. Each entry fires once, at its tick,
// against a specific real unit ID from the mock fleet.
const ARCS = [
  { tick: 6, unitId: "UNIT-03", state: "warning",
    text: "Phase correction executed \u2014 J severity reduced.", kind: "correction",
    toast: { level: "warning", text: "UNIT-03 improving \u2014 Critical \u2192 Warning" } },
  { tick: 18, unitId: "UNIT-03", state: "caution",
    text: "Sustained improvement confirmed \u2014 TSI trending upward.", kind: "note",
    toast: null },
  { tick: 30, unitId: "UNIT-03", state: "healthy",
    text: "UNIT-03 restored to healthy \u2014 corrective action successful.", kind: "reclose",
    toast: { level: "healthy", text: "UNIT-03 corrected \u2014 back to Healthy" } },

  { tick: 12, unitId: "UNIT-06", state: "caution",
    text: "Load variation observed above baseline.", kind: "note",
    toast: null },
  { tick: 24, unitId: "UNIT-06", state: "warning",
    text: "Phase imbalance trending upward \u2014 monitor closely.", kind: "alert",
    toast: { level: "warning", text: "UNIT-06 escalated \u2014 Caution \u2192 Warning" } },
  { tick: 42, unitId: "UNIT-06", state: "critical",
    text: "DRI threshold crossed \u2014 recommend immediate review.", kind: "trip",
    toast: { level: "critical", text: "UNIT-06 escalated \u2014 Warning \u2192 Critical" } },
];

function severityBucket(state) {
  if (state === "emergency" || state === "critical") return "high";
  if (state === "warning") return "mid";
  return "low";
}

function seedFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

function jitter(base, tick, seedOffset, amplitude) {
  return base + Math.sin((tick + seedOffset) * 0.5) * amplitude;
}

export function useLiveFleetSimulation(baseUnits) {
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);
  const [injected, setInjected] = useState({}); // unitId -> [events]
  const [stateOverride, setStateOverride] = useState({}); // unitId -> state
  const [toasts, setToasts] = useState([]); // [{id, level, text}]
  const injectRoll = useRef(0);
  const toastIdRef = useRef(0);
  const firedArcs = useRef(new Set());

  useEffect(() => {
    if (!running) return;
    if (tick >= SIM_TICKS) { setRunning(false); return; }
    const t = setTimeout(() => setTick((v) => v + 1), TICK_MS);
    return () => clearTimeout(t);
  }, [tick, running]);

  // Fire any scripted arc steps due at this tick.
  useEffect(() => {
    if (!running) return;
    for (const arc of ARCS) {
      const key = `${arc.unitId}-${arc.tick}`;
      if (arc.tick !== tick || firedArcs.current.has(key)) continue;
      firedArcs.current.add(key);

      setStateOverride((prev) => ({ ...prev, [arc.unitId]: arc.state }));
      setInjected((prev) => ({
        ...prev,
        [arc.unitId]: [{ kind: arc.kind, text: arc.text, minutesAgo: 0 }, ...(prev[arc.unitId] || [])],
      }));
      if (arc.toast) {
        toastIdRef.current += 1;
        const toastEntry = { id: toastIdRef.current, level: arc.toast.level, text: arc.toast.text };
        setToasts((prev) => [...prev, toastEntry]);
      }
    }
  }, [tick, running]);

  // Occasionally inject an ambient event into a random unit, weighted
  // toward units that are already in worse shape.
  useEffect(() => {
    if (!running || baseUnits.length === 0) return;
    injectRoll.current = (injectRoll.current + 1) % 5;
    if (injectRoll.current !== 0) return; // roughly every 5th tick
    const weighted = baseUnits.flatMap((u) => {
      const state = stateOverride[u.id] || u.state;
      const weight = { healthy: 1, caution: 1, warning: 2, critical: 3, emergency: 3 }[state] || 1;
      return Array(weight).fill(u);
    });
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    if (!pick) return;
    const bucket = severityBucket(stateOverride[pick.id] || pick.state);
    const pool = AMBIENT_POOL[bucket];
    const text = pool[Math.floor(Math.random() * pool.length)];
    setInjected((prev) => ({
      ...prev,
      [pick.id]: [{ kind: bucket === "low" ? "note" : bucket === "mid" ? "alert" : "correction", text, minutesAgo: 0 }, ...(prev[pick.id] || [])],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, running, baseUnits]);

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const restart = () => {
    setInjected({});
    setStateOverride({});
    setToasts([]);
    firedArcs.current = new Set();
    setTick(0);
    setRunning(true);
  };

  const units = useMemo(() => {
    return baseUnits
      .map((u) => {
        const seed = seedFromId(u.id);
        const tsi = Math.max(0, Math.min(1, jitter(u.tsi, tick, seed, 0.015)));
        const dri = Math.max(0, Math.min(1, jitter(u.dri, tick, seed + 7, 0.02)));
        const [r0, y0, b0] = u.phase;
        const phase = [
          Math.max(1, Math.round(jitter(r0, tick, seed, 1.2))),
          Math.max(1, Math.round(jitter(y0, tick, seed + 3, 1.2))),
          Math.max(1, Math.round(jitter(b0, tick, seed + 5, 1.2))),
        ];
        const extra = injected[u.id] || [];
        const state = stateOverride[u.id] || u.state;
        return { ...u, state, tsi, dri, phase, events: [...extra, ...u.events] };
      })
      .sort((a, b) => {
        const rank = { emergency: 4, critical: 3, warning: 2, caution: 1, healthy: 0 };
        return rank[b.state] - rank[a.state];
      });
  }, [baseUnits, tick, injected, stateOverride]);

  const secondsLeft = Math.max(0, (SIM_TICKS - tick) * (TICK_MS / 1000));

  return { units, running, secondsLeft, restart, toasts, dismissToast };
}
