/**
 * The 44×24 switch used throughout the settings screens. The design draws it as
 * a bare <button> with a positioned knob; this keeps the visuals and adds the
 * switch semantics assistive tech needs to report on/off state.
 */
export function SalisToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-xl border-none transition-colors duration-200"
      style={{
        background: checked ? "var(--salis-gradient)" : "var(--border-strong)",
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full transition-[inset-inline-start] duration-200"
        style={{
          insetInlineStart: checked ? 22 : 2,
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }}
      />
    </button>
  );
}
