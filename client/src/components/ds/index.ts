/**
 * SALIS AUTO design-system components.
 *
 * Import from this barrel rather than reaching into individual files — the
 * design system's own lint config (`_adherence.oxlintrc.json`) restricts imports
 * of component internals for exactly this reason.
 *
 * Ported so far: the primitives the built screens use. The upstream bundle also
 * ships Alert, Badge, Progress, LinearLoader, Skeleton, EmptyState, Tooltip,
 * Checkbox, RadioGroup, Select, Textarea, Breadcrumb, PageHeader, Accordion,
 * Dialog, StatCard, Tabs and the Table family.
 */
export { Avatar } from "./avatar";
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "./button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
} from "./card";
export { Input, type InputProps, type InputSize } from "./input";
export { Label, type LabelProps } from "./label";
export { Separator } from "./separator";
export {
  StatusBadge,
  type StatusBadgeProps,
  type StatusTone,
  type StatusVariant,
} from "./status-badge";
export { Switch, type SwitchProps } from "./switch";
export { Toast, type ToastProps, type ToastVariant } from "./toast";
