import { useState, type CSSProperties, type ReactNode } from "react";

/**
 * SALIS AUTO <Switch> — ported from components/forms/Switch.jsx.
 *
 * Controlled when `checked` is supplied, uncontrolled otherwise, matching
 * upstream. The knob offset uses a logical property instead of upstream's
 * `transform: translateX(20px)`, which drives the knob off the wrong edge in
 * Arabic.
 */
export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  /** Accessible name when no visible `label` is rendered. */
  "aria-label"?: string;
  disabled?: boolean;
  style?: CSSProperties;
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  disabled,
  style,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const on = checked !== undefined ? checked : uncontrolled;

  const toggle = () => {
    const next = !on;
    if (checked === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  const button = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={on ? "sa-switch sa-switch-on" : "sa-switch"}
      disabled={disabled}
      onClick={toggle}
      style={label ? undefined : style}
    >
      <i />
    </button>
  );

  if (!label) return button;

  return (
    <span className="sa-switch-row" style={style}>
      {button}
      <span>{label}</span>
    </span>
  );
}
