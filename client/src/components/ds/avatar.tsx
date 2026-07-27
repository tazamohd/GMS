import type { CSSProperties } from "react";

/**
 * SALIS AUTO <Avatar> — ported from components/surfaces/Avatar.jsx.
 *
 * Falls back to a gradient circle with the name's initial, which the design
 * system documents as the sidebar avatar treatment.
 */
export function Avatar({
  src,
  name = "",
  size = 40,
  style,
}: {
  src?: string;
  name?: string;
  size?: number;
  style?: CSSProperties;
}) {
  const initial = (name.trim()[0] || "U").toUpperCase();

  return (
    <span
      className="sa-avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, ...style }}
      title={name}
      // The name is already rendered as text beside every current usage, so the
      // initial is decoration rather than content worth announcing twice.
      aria-hidden={!src || undefined}
    >
      {src ? <img src={src} alt={name} /> : initial}
    </span>
  );
}
