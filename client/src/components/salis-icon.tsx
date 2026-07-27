import {
  Bell,
  Building2,
  Calendar,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Globe,
  Headphones,
  LayoutDashboard,
  Lock,
  LogOut,
  Moon,
  Package,
  Plug,
  Receipt,
  Save,
  Settings,
  Shield,
  Sun,
  Truck,
  UserCog,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * React stand-in for the design files' `<salis-icon name="…" size="…">` custom
 * element, which wrapped Lucide's UMD build.
 *
 * Icons are registered explicitly rather than star-imported so the bundler can
 * drop the rest of the set — Lucide ships well over a thousand.
 */
const ICONS = {
  Bell,
  Building2,
  Calendar,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Globe,
  Headphones,
  LayoutDashboard,
  Lock,
  LogOut,
  Moon,
  Package,
  Plug,
  Receipt,
  Save,
  Settings,
  Shield,
  Sun,
  Truck,
  UserCog,
  Users,
  Wrench,
} satisfies Record<string, LucideIcon>;

export type SalisIconName = keyof typeof ICONS;

export function SalisIcon({
  name,
  size = 16,
  className,
  style,
}: {
  name: SalisIconName | (string & {});
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = ICONS[name as SalisIconName];

  // An unregistered name should leave a correctly-sized hole rather than
  // collapsing the layout around it.
  if (!Icon) {
    if (import.meta.env.DEV) {
      console.warn(`[SalisIcon] no icon registered for "${name}"`);
    }
    return <span aria-hidden="true" style={{ display: "inline-block", width: size, height: size }} />;
  }

  return (
    <Icon size={size} className={className} style={style} aria-hidden="true" focusable="false" />
  );
}
