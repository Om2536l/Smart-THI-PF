import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import GlossaryPanel from "./components/GlossaryPanel.jsx";
import ToastStack from "./components/ToastStack.jsx";
import FleetPage from "./pages/FleetPage.jsx";
import UnitDetailPage from "./pages/UnitDetailPage.jsx";
import MethodologyPage from "./pages/MethodologyPage.jsx";
import AlertsPage from "./pages/AlertsPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import { fetchUnits, fetchAlerts } from "./data/units.js";
import { useAcknowledgedAlerts } from "./lib/useAcknowledgedAlerts.js";
import { useLiveFleetSimulation } from "./lib/useLiveFleetSimulation.js";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("smart-thi-theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("smart-thi-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0B1417" : "#F3F6F5");
  }, [theme]);
  return [theme, setTheme];
}

export default function App() {
  const hash = useHashRoute();
  const [theme, setTheme] = useTheme();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const baseUnits = useMemo(() => fetchUnits(), []);
  const { units, running, secondsLeft, restart, toasts, dismissToast } = useLiveFleetSimulation(baseUnits);
  const { isAcked, acknowledge } = useAcknowledgedAlerts();
  const openAlertCount = useMemo(
    () => fetchAlerts(units).filter((a) => !isAcked(a)).length,
    [units, isAcked]
  );

  useEffect(() => { window.scrollTo(0, 0); }, [hash]);

  let page;
  const unitMatch = hash.match(/^#\/unit\/([\w-]+)/);
  if (unitMatch) {
    const unit = units.find((u) => u.id === unitMatch[1]);
    page = <UnitDetailPage unit={unit} />;
  } else if (hash.startsWith("#/methodology")) {
    page = <MethodologyPage />;
  } else if (hash.startsWith("#/alerts")) {
    page = <AlertsPage units={units} acknowledge={acknowledge} isAcked={isAcked} />;
  } else if (hash.startsWith("#/network")) {
    page = <NetworkPage units={units} />;
  } else {
    page = <FleetPage units={units} />;
  }

  const onlineCount = units.filter((u) => u.node.online).length;

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onlineCount={onlineCount}
        totalCount={units.length}
        onOpenGlossary={() => setGlossaryOpen(true)}
        hash={hash}
        alertCount={openAlertCount}
        liveRunning={running}
        liveSecondsLeft={secondsLeft}
        onRestartLive={restart}
      />
      <main>{page}</main>
      <Footer />
      <GlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
