import type { LabelHTMLAttributes, ReactNode } from "react";

/** SALIS AUTO <Label> — ported from components/forms/Label.jsx. */
export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
  children?: ReactNode;
};

export function Label({ required, children, className, ...rest }: LabelProps) {
  return (
    <label className={["sa-label", required && "req", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </label>
  );
}
