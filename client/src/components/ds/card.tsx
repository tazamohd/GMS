import type { HTMLAttributes } from "react";

/** SALIS AUTO <Card> family — ported from components/surfaces/Card.jsx. */
export type CardProps = HTMLAttributes<HTMLDivElement> & { hoverable?: boolean };

export function Card({ hoverable, className, ...rest }: CardProps) {
  return (
    <div
      className={["sa-card", hoverable && "sa-card-hoverable", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="sa-card-header" {...props} />;
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className="sa-card-title" {...props} />;
}

export function CardDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p className="sa-card-desc" {...props} />;
}

export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="sa-card-content" {...props} />;
}

export function CardFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="sa-card-footer" {...props} />;
}
