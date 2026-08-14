// Mock fleet data for SMART-THI dashboard.
// Values are illustrative — the dashboard is a demonstration shell built
// ahead of hardware deployment. Replace fetchUnits() with a real API/MQTT
// bridge to the ESP32 nodes when the primary node is online.

export const STATES = ["healthy", "caution", "warning", "critical", "emergency"];

export const STATE_META = {
  healthy: { label: "Healthy", rank: 0, action: "No action needed" },
  caution: { label: "Caution", rank: 1, action: "No action — within normal variance" },
  warning: { label: "Warning", rank: 2, action: "Keep watching" },
  critical: { label: "Critical", rank: 3, action: "Check soon" },
  emergency: { label: "Emergency", rank: 4, action: "Act now" },
};

const RAW = [
  { id: "UNIT-01", feeder: "Kopargaon Feeder 1", state: "healthy", tsi: 0.90, ths: 88, dri: 0.12, rul: 27.4, phase: [41, 42, 40], rssi: -54, uptimeDays: 61, lastSeenMin: 1, fw: "1.4.2" },
  { id: "UNIT-02", feeder: "Kopargaon Feeder 2", state: "caution", tsi: 0.70, ths: 74, dri: 0.29, rul: 21.2, phase: [44, 46, 43], rssi: -61, uptimeDays: 44, lastSeenMin: 2, fw: "1.4.2" },
  { id: "UNIT-03", feeder: "Sanjivani Campus", state: "critical", tsi: 0.32, ths: 46, dri: 0.68, rul: 8.6, phase: [39, 52, 33], rssi: -71, uptimeDays: 12, lastSeenMin: 1, fw: "1.4.1" },
  { id: "UNIT-04", feeder: "Rahata Feeder 1", state: "healthy", tsi: 0.87, ths: 91, dri: 0.14, rul: 29.1, phase: [40, 41, 39], rssi: -49, uptimeDays: 88, lastSeenMin: 1, fw: "1.4.2" },
  { id: "UNIT-05", feeder: "Rahata Feeder 3", state: "warning", tsi: 0.52, ths: 61, dri: 0.48, rul: 14.3, phase: [45, 49, 41], rssi: -66, uptimeDays: 30, lastSeenMin: 3, fw: "1.4.2" },
  { id: "UNIT-06", feeder: "Kopargaon Feeder 4", state: "healthy", tsi: 0.84, ths: 85, dri: 0.17, rul: 24.8, phase: [43, 44, 42], rssi: -58, uptimeDays: 70, lastSeenMin: 2, fw: "1.4.2" },
  { id: "UNIT-07", feeder: "Shrirampur Feeder 1", state: "emergency", tsi: 0.15, ths: 31, dri: 0.85, rul: 3.2, phase: [42, 61, 34], rssi: -79, uptimeDays: 6, lastSeenMin: 1, fw: "1.4.1" },
  { id: "UNIT-08", feeder: "Shrirampur Feeder 2", state: "healthy", tsi: 0.93, ths: 94, dri: 0.09, rul: 30.0, phase: [39, 40, 38], rssi: -52, uptimeDays: 95, lastSeenMin: 1, fw: "1.4.2" },
];

// Substation each feeder is fed from — used by the network single-line view.
export const SUBSTATIONS = [
  { name: "Kopargaon 33/11kV Substation", feeders: ["Kopargaon Feeder 1", "Kopargaon Feeder 2", "Kopargaon Feeder 4"] },
  { name: "Rahata 33/11kV Substation", feeders: ["Rahata Feeder 1", "Rahata Feeder 3"] },
  { name: "Shrirampur 33/11kV Substation", feeders: ["Shrirampur Feeder 1", "Shrirampur Feeder 2"] },
  { name: "Sanjivani Campus Substation", feeders: ["Sanjivani Campus"] },
];

// Small deterministic PRNG so trend/event data is stable across renders
// without needing to hand-write 8 arrays of history.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

// Generic 14-point trend generator so any index (TSI, THS, DRI, RUL) can be
// plotted the same way — the historian view on a unit's detail page.
const METRIC_CONFIG = {
  tsi:  { unit: "",  decimals: 2, driftsDown: true,  scale: 1 },
  ths:  { unit: "%", decimals: 0, driftsDown: true,  scale: 1 },
  dri:  { unit: "",  decimals: 2, driftsDown: false, scale: 1 },
  rul:  { unit: "y", decimals: 1, driftsDown: true,  scale: 1 },
};

function buildTrend(unit, metric, seedOffset = 0) {
  const cfg = METRIC_CONFIG[metric];
  const rand = mulberry32(seedFromId(unit.id) ^ seedOffset);
  const points = 14;
  const current = unit[metric];
  const severity = 1 - unit.tsi; // shared severity driver across all indices
  const swing = metric === "dri" ? 0.5 : metric === "ths" ? 22 : metric === "rul" ? 6 : 0.4;
  const out = [];
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const trendAmount = cfg.driftsDown ? (1 - progress) : progress;
    const base = current + (cfg.driftsDown ? 1 : -1) * severity * swing * trendAmount;
    const noise = (rand() - 0.5) * swing * 0.25;
    out.push(+(base + noise).toFixed(cfg.decimals));
  }
  out[out.length - 1] = current;
  return out;
}

function buildRulTrend(unit) { return buildTrend(unit, "rul", 0); }

const EVENT_LIBRARY = {
  emergency: [
    { kind: "trip", text: "Fault confirmed (DRI \u2265 0.8) \u2014 relay tripped" },
    { kind: "reclose", text: "Reclose attempt 1/3 \u2014 fault persisted" },
    { kind: "reclose", text: "Reclose attempt 2/3 \u2014 fault persisted" },
    { kind: "correction", text: "Phase correction executed \u2014 J: 512 \u2192 89" },
    { kind: "alert", text: "Escalated to duty engineer" },
  ],
  critical: [
    { kind: "correction", text: "Phase correction executed \u2014 J: 340 \u2192 41" },
    { kind: "alert", text: "Threshold crossed \u2014 THS below 50%" },
  ],
  warning: [
    { kind: "correction", text: "Phase correction executed \u2014 J: 210 \u2192 38" },
    { kind: "note", text: "Load variation above baseline for 40 min" },
  ],
  caution: [
    { kind: "note", text: "Minor imbalance observed, within tolerance" },
  ],
  healthy: [
    { kind: "note", text: "Routine check \u2014 all indices nominal" },
  ],
};

function buildEvents(unit) {
  const rand = mulberry32(seedFromId(unit.id) ^ 0x9e3779b9);
  const templates = EVENT_LIBRARY[unit.state];
  let minutesAgo = 6 + Math.floor(rand() * 20);
  return templates.map((t) => {
    const e = { ...t, minutesAgo };
    minutesAgo += 30 + Math.floor(rand() * 90);
    return e;
  });
}

export function fetchUnits() {
  return RAW.map((u) => ({
    ...u,
    aps: STATE_META[u.state].action,
    rulTrend: buildRulTrend(u),
    trends: {
      tsi: buildTrend(u, "tsi", 0x1),
      ths: buildTrend(u, "ths", 0x2),
      dri: buildTrend(u, "dri", 0x3),
      rul: buildTrend(u, "rul", 0x4),
    },
    node: {
      online: u.lastSeenMin < 10,
      lastSeenMin: u.lastSeenMin,
      rssi: u.rssi,
      signalBars: u.rssi > -55 ? 5 : u.rssi > -62 ? 4 : u.rssi > -68 ? 3 : u.rssi > -75 ? 2 : 1,
      uptimeDays: u.uptimeDays,
      firmware: u.fw,
    },
    events: buildEvents(u),
  })).sort((a, b) => STATE_META[b.state].rank - STATE_META[a.state].rank);
}

// Flattens every unit's event log into one fleet-wide, time-sorted alarm
// feed — the "central alarm" view real SCADA/DMS control rooms use, rather
// than requiring an operator to open each unit individually.
export function fetchAlerts(units) {
  const ALERT_KINDS = ["trip", "reclose", "correction", "alert"];
  return units
    .flatMap((u) =>
      u.events
        .filter((e) => ALERT_KINDS.includes(e.kind))
        .map((e) => ({ ...e, unitId: u.id, feeder: u.feeder, state: u.state }))
    )
    .sort((a, b) => a.minutesAgo - b.minutesAgo);
}

// Decision-engine state boundaries — Chapter 4.7 of the project guide.
// Shown on the Methodology page so judges can see these are tuned
// thresholds, not hidden magic numbers.
export const THRESHOLDS = [
  { state: "healthy",   condition: "TSI \u2265 0.80  and  DRI < 0.20" },
  { state: "caution",   condition: "0.60 \u2264 TSI < 0.80  or  0.20 \u2264 DRI < 0.40" },
  { state: "warning",   condition: "0.40 \u2264 TSI < 0.60  or  0.40 \u2264 DRI < 0.60" },
  { state: "critical",  condition: "0.20 \u2264 TSI < 0.40  or  0.60 \u2264 DRI < 0.80" },
  { state: "emergency", condition: "TSI < 0.20  or  DRI \u2265 0.80" },
];

export const FLEET_LOCATION = "Kopargaon & neighbouring feeders, Maharashtra";

// AHP vs empirical weight derivation — fleet-wide methodology result
// (Chapter 4.8 of the project guide), shown on the Methodology page.
export const WEIGHTS = [
  { key: "Vs", label: "Voltage stability", ahp: 0.22, empirical: 0.19 },
  { key: "Cf", label: "Current fluctuation", ahp: 0.18, empirical: 0.21 },
  { key: "Tv", label: "Temperature variation", ahp: 0.24, empirical: 0.27 },
  { key: "PI", label: "Phase imbalance", ahp: 0.26, empirical: 0.23 },
  { key: "Lv", label: "Load variation", ahp: 0.10, empirical: 0.10 },
];

export const CONSISTENCY_RATIO = 0.043;
