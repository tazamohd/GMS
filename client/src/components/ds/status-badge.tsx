import type { CSSProperties, ReactNode } from "react";

/**
 * SALIS AUTO <StatusBadge> — ported from components/feedback/StatusBadge.jsx.
 *
 * Blue is success here; green is forbidden by brand law. Upstream's guidance is
 * to extend the status map rather than fork the component, so integration
 * states used by the settings screen are added to it below.
 */
export type StatusVariant = "success" | "info" | "warning" | "destructive" | "neutral";
export type StatusTone = "subtle" | "strong";

const MAP: Record<string, StatusVariant> = {
  completed: "success",
  paid: "success",
  delivered: "success",
  active: "success",
  resolved: "success",
  approved: "success",
  signed: "success",
  in_progress: "info",
  repair: "info",
  assigned: "info",
  sent: "info",
  scheduled: "info",
  shipped: "info",
  processing: "info",
  pending: "warning",
  waiting: "warning",
  draft: "warning",
  on_hold: "warning",
  cancelled: "destructive",
  canceled: "destructive",
  unpaid: "destructive",
  overdue: "destructive",
  failed: "destructive",
  rejected: "destructive",
  expired: "destructive",
  // Added for the settings screen's integration rows.
  connected: "success",
  disconnected: "warning",
};

const SUBTLE: Record<StatusVariant, [string, string]> = {
  success: ["rgba(10,94,215,.12)", "var(--success)"],
  info: ["rgba(11,179,255,.12)", "#0891b2"],
  warning: ["rgba(249,115,22,.12)", "var(--warning)"],
  destructive: ["rgba(249,115,22,.12)", "#EA580C"],
  neutral: ["var(--border-default)", "var(--text-muted)"],
};

const STRONG: Record<StatusVariant, string> = {
  success: "var(--success)",
  info: "var(--info)",
  warning: "var(--warning)",
  destructive: "#EA580C",
  neutral: "var(--text-muted)",
};

export type StatusBadgeProps = {
  status?: string;
  variant?: StatusVariant;
  tone?: StatusTone;
  children?: ReactNode;
  style?: CSSProperties;
};

export function StatusBadge({
  status,
  variant,
  tone = "subtle",
  children,
  style,
}: StatusBadgeProps) {
  const normalized = (status ?? "").toLowerCase().replace(/\s+/g, "_");
  const resolved = variant ?? MAP[normalized] ?? "neutral";
  const label = children ?? (status ? status.replace(/_/g, " ") : "Unknown");

  const tonal =
    tone === "strong"
      ? { background: STRONG[resolved], color: "#fff" }
      : { background: SUBTLE[resolved][0], color: SUBTLE[resolved][1] };

  return (
    <span className="sa-status" style={{ ...tonal, ...style }}>
      {label}
    </span>
  );
}
