import type { CSSProperties } from "react";

/** SALIS AUTO <Separator> — ported from components/surfaces/Separator.jsx. */
export function Separator({ vertical, style }: { vertical?: boolean; style?: CSSProperties }) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      style={{
        background: "var(--border-default)",
        flexShrink: 0,
        ...(vertical ? { width: 1, alignSelf: "stretch" } : { height: 1, width: "100%" }),
        ...style,
      }}
    />
  );
}
