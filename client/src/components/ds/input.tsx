import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

/**
 * SALIS AUTO <Input> — ported from components/forms/Input.jsx.
 *
 * With an `icon`, the field is wrapped and the icon absolutely positioned at the
 * inline-start edge; the input reserves padding on that side to match.
 */
const HEIGHTS = { sm: 36, default: 44, lg: 48 } as const;

export type InputSize = keyof typeof HEIGHTS;

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize;
  icon?: ReactNode;
  wrapStyle?: CSSProperties;
};

export function Input({ size = "default", icon, style, wrapStyle, ...rest }: InputProps) {
  const field = (
    <input
      className="sa-input"
      style={{
        height: HEIGHTS[size],
        // Upstream hardcodes `0 12px 0 40px`, which reserves the icon gutter on
        // the left even in Arabic, where the icon sits on the right. Logical
        // padding keeps the gutter on the same side as the icon.
        paddingBlock: 0,
        paddingInlineStart: icon ? 40 : 12,
        paddingInlineEnd: 12,
        ...style,
      }}
      {...rest}
    />
  );

  if (!icon) return field;

  return (
    <span className="sa-input-wrap" style={wrapStyle}>
      <span className="sa-input-icon">{icon}</span>
      {field}
    </span>
  );
}
