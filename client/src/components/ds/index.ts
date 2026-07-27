/**
 * SALIS AUTO design-system components.
 *
 * Import from this barrel rather than reaching into individual files — the
 * design system's own lint config (`_adherence.oxlintrc.json`) restricts imports
 * of component internals for exactly this reason.
 *
 * Ported so far: the primitives the built screens need. The upstream bundle also
 * ships Alert, Badge, StatusBadge, Progress, LinearLoader, Skeleton, EmptyState,
 * Tooltip, Checkbox, RadioGroup, Select, Switch, Textarea, Breadcrumb,
 * PageHeader, Accordion, Avatar, Card, Dialog, Separator, StatCard, Tabs and the
 * Table family.
 */
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "./button";
export { Input, type InputProps, type InputSize } from "./input";
export { Label, type LabelProps } from "./label";
export { Toast, type ToastProps, type ToastVariant } from "./toast";
