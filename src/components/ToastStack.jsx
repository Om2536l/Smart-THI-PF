import React, { useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, AlertTriangle, X } from "lucide-react";

const STYLE = {
  healthy: { color: "var(--healthy)", bg: "var(--healthy-bg)", Icon: ArrowDownCircle },
  warning: { color: "var(--warning)", bg: "var(--warning-bg)", Icon: AlertTriangle },
  critical: { color: "var(--critical)", bg: "var(--critical-bg)", Icon: ArrowUpCircle },
};

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id]);

  const s = STYLE[toast.level] || STYLE.warning;
  const Icon = s.Icon;

  return (
    <div
      className="card"
      role="status"
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
        borderColor: s.color, minWidth: 260, maxWidth: 340,
        animation: "toast-in .25s ease",
      }}
    >
      <Icon size={18} color={s.color} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, flex: 1 }}>{toast.text}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, color: "var(--ink-mute)" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="no-print"
      style={{
        position: "fixed", top: "calc(env(safe-area-inset-top, 0px) + 78px)", right: 16, zIndex: 30,
        display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end",
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        @media (max-width: 480px) {
          div[role="status"] { min-width: 0 !important; max-width: calc(100vw - 32px) !important; }
        }
      `}</style>
    </div>
  );
}
