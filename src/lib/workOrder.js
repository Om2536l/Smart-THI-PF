export function buildWorkOrderText({ unitId, feeder, state, action, tsi, rul, phase, generatedFor }) {
  const now = new Date();
  const id = `WO-${unitId.replace("UNIT-", "")}-${now.getTime().toString().slice(-6)}`;
  return [
    "SMART-THI \u2014 MAINTENANCE WORK ORDER",
    "=".repeat(40),
    `Ticket:        ${id}`,
    `Generated:     ${now.toLocaleString("en-IN")}`,
    generatedFor ? `Raised from:   ${generatedFor}` : null,
    "",
    `Unit:          ${unitId}`,
    `Feeder:        ${feeder}`,
    `Status:        ${state.toUpperCase()}`,
    "",
    "RECOMMENDED ACTION",
    "-".repeat(40),
    action,
    "",
    "SNAPSHOT AT TIME OF TICKET",
    "-".repeat(40),
    `TSI (stability):        ${tsi}`,
    `RUL (life remaining):   ${rul} years`,
    phase ? `Phase currents (R/Y/B): ${phase[0]}A / ${phase[1]}A / ${phase[2]}A` : null,
    "",
    "This ticket was generated automatically from the Action Priority Score",
    "(APS) computed by SMART-THI. Mock data \u2014 not a live sensor reading.",
  ].filter(Boolean).join("\n");
}

export function downloadWorkOrder(unit, source) {
  const text = buildWorkOrderText({
    unitId: unit.id,
    feeder: unit.feeder,
    state: unit.state,
    action: unit.aps,
    tsi: unit.tsi.toFixed(2),
    rul: unit.rul,
    phase: unit.phase,
    generatedFor: source,
  });
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${unit.id}-work-order.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
