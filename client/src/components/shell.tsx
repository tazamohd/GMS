import { type ReactNode } from "react";

import { SalisSidebar } from "@/components/salis-sidebar";
import { SalisIcon } from "@/components/salis-icon";
import { useTranslate } from "@/lib/i18n";
import { useSalisPrefs } from "@/lib/salis-prefs";

/**
 * The persistent layout wrapper — every screen except the auth ones
 * (Login, Account Locked, etc.) renders inside it.
 *
 * Structural extraction from `pages/advanced-settings.tsx` where the same
 * markup was inlined: page-bg root, sidebar rail on the start edge, main
 * column with a fixed-height topbar and a scrolling content area.
 *
 * Spec-only for now — the mobile version (hamburger + drawer) is a
 * follow-up once the mobile `.dc.html` files reach this session. Under
 * `sm` this still renders the desktop shell; screens continue to compose
 * their own mobile layouts inline as `advanced-settings.tsx` does today.
 *
 * The topbar right side accepts extra actions via `topbarRight`; the
 * theme toggle is always present because every screen in the design
 * carries one. Screens that need a title in the topbar (Dashboard,
 * JobCards) pass it as `topbarLeft` — an inline title is closer to the
 * design than a shell-owned title prop that would need spacing tokens
 * screens don't control.
 */
export interface ShellProps {
  /** Which sidebar item is highlighted. See `NAV` in `lib/gms-data.ts`
   *  for the exact labels — `activeItem` is compared against `item.l`. */
  activeItem?: string;
  /** `data-screen-label` on the outer div. Kept because the design
   *  snapshots in the bundle carry this attribute and the debug tooling
   *  reads it. */
  screenLabel?: string;
  /** Optional slot on the topbar's start (leading) edge — usually a title
   *  or breadcrumb. */
  topbarLeft?: ReactNode;
  /** Optional slot on the topbar's end (trailing) edge, rendered before
   *  the always-present theme toggle. Search boxes, user menu, etc. */
  topbarRight?: ReactNode;
  /** Main content area. Scrolls; the topbar and sidebar do not. */
  children: ReactNode;
}

export function Shell({
  activeItem,
  screenLabel,
  topbarLeft,
  topbarRight,
  children,
}: ShellProps) {
  const { t } = useTranslate();
  const { toggleTheme, dark } = useSalisPrefs();
  const themeIcon = dark ? "Sun" : "Moon";
  const themeLabel = t(dark ? "Light mode" : "Dark mode");

  return (
    <div
      data-screen-label={screenLabel}
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-page)", fontFamily: "var(--font-ui)" }}
    >
      <SalisSidebar activeItem={activeItem} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex flex-shrink-0 items-center gap-3 px-6"
          style={{
            height: "var(--h-topbar)",
            background: "var(--surface-sidebar)",
            borderBottom: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {topbarLeft}
          <div className="flex-1" />
          {topbarRight}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent hover:bg-[rgba(10,94,215,.1)]"
            style={{ color: "var(--text-muted)" }}
          >
            <SalisIcon name={themeIcon} size={16} />
          </button>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
