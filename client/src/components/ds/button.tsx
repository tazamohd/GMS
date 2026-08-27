import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

/**
 * SALIS AUTO <Button> — ported from components/actions/Button.jsx.
 *
 * Visuals live in the `.sa-btn*` rules in index.css; only the size geometry is
 * applied inline, exactly as upstream does.
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "default" | "lg" | "icon";

const SIZES: Record<ButtonSize, CSSProperties> = {
  sm: { height: 36, padding: "0 16px", fontSize: 14, borderRadius: 6 },
  default: { height: 44, padding: "0 24px", fontSize: 16 },
  lg: { height: 48, padding: "0 32px", fontSize: 18 },
  icon: { height: 44, width: 44, padding: 0 },
};

/**
 * Spelled out rather than built as `sa-btn-${variant}`.
 *
 * Tailwind tree-shakes custom CSS in `@layer components` by scanning source for
 * literal class names, so an interpolated name is stripped from the build and
 * the button ships with no background at all.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "sa-btn-primary",
  secondary: "sa-btn-secondary",
  outline: "sa-btn-outline",
  ghost: "sa-btn-ghost",
  danger: "sa-btn-danger",
  link: "sa-btn-link",
};

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "default",
  children,
  style,
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      // Upstream omits this, so a <Button> inside a form defaults to
      // type="submit" and silently submits it.
      type={type}
      className={["sa-btn", VARIANT_CLASSES[variant], className].filter(Boolean).join(" ")}
      style={{ ...SIZES[size], ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
