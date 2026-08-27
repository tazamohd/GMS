import type { CSSProperties, ReactNode } from "react";

/** SALIS AUTO <Toast> — ported from components/feedback/Toast.jsx. */
export type ToastVariant = "default" | "destructive";

export type ToastProps = {
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
  style?: CSSProperties;
};

export function Toast({ variant = "default", title, description, onClose, style }: ToastProps) {
  return (
    <div
      className={`sa-toast${variant === "destructive" ? " sa-toast-destructive" : ""}`}
      role="status"
      // A validation failure needs to interrupt; a success note does not.
      aria-live={variant === "destructive" ? "assertive" : "polite"}
      style={style}
    >
      <div style={{ flex: 1 }}>
        <p className="sa-toast-title">{title}</p>
        {description && <p className="sa-toast-desc">{description}</p>}
      </div>
      {onClose && (
        <button type="button" className="sa-toast-close" onClick={onClose} aria-label="Dismiss">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
