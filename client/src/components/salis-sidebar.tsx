import { useState } from "react";
import { Link } from "wouter";

import { SalisIcon } from "@/components/salis-icon";
import { NAV } from "@/lib/gms-data";
import { useTranslate } from "@/lib/i18n";
import { useSalisPrefs } from "@/lib/salis-prefs";

const USER = { name: "Khalid Al-Amri", initial: "K" };

/**
 * Desktop navigation rail from `AdvancedSettings.dc.html`: user card, collapsible
 * groups, then the language and logout controls pinned to the bottom.
 *
 * As in the design, every item in a group renders that group's icon.
 */
export function SalisSidebar({ activeItem }: { activeItem?: string }) {
  const { t, rtl } = useTranslate();
  const { toggleLang } = useSalisPrefs();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <aside
      className="flex h-screen flex-shrink-0 flex-col"
      style={{
        width: "var(--w-sidebar)",
        background: "var(--surface-sidebar)",
        borderInlineEnd: "1px solid var(--border-default)",
      }}
    >
      <div className="px-3 pb-1 pt-3">
        <div
          className="flex items-center gap-2 rounded-lg border p-2"
          style={{ background: "var(--surface-inset)", borderColor: "var(--border-default)" }}
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ background: "var(--salis-gradient)", color: "#fff" }}
          >
            {USER.initial}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="m-0 truncate text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {USER.name}
            </p>
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full px-1.5 py-px text-[10px] font-semibold"
                style={{ background: "rgba(10,94,215,.12)", color: "var(--salis-blue)" }}
              >
                {t("ADMIN")}
              </span>
              <span
                className="rounded-full px-1.5 py-px text-[10px] font-semibold"
                style={{ background: "var(--salis-gradient)", color: "#fff" }}
              >
                PRO
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-0.5">
          {NAV.map((group) => {
            const open = !collapsed[group.label];
            return (
              <div key={group.label}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setCollapsed((current) => ({ ...current, [group.label]: open }))
                  }
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent p-2 text-[13px] font-extrabold uppercase tracking-[.05em] hover:bg-[rgba(10,94,215,.1)]"
                  style={{ fontFamily: "var(--font-action)", color: "var(--text-primary)" }}
                >
                  <span>{t(group.label)}</span>
                  <span className="flex-1" />
                  <SalisIcon
                    name={open ? "ChevronDown" : "ChevronRight"}
                    size={12}
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>

                {open && (
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = item.l === activeItem;
                      return (
                        <Link
                          key={item.l}
                          href={item.href}
                          /* The design hardcodes `padding-left: 28px` for the indent,
                             which lands on the wrong side in Arabic — use the logical
                             property so it flips with `dir`. */
                          className="flex items-center gap-2 rounded-md p-2 text-[13px] font-medium no-underline"
                          style={{
                            paddingInlineStart: 28,
                            fontFamily: "var(--font-action)",
                            ...(active
                              ? { background: "var(--salis-gradient)", color: "#fff" }
                              : { color: "var(--text-body)" }),
                          }}
                        >
                          <SalisIcon name={group.icon} size={14} />
                          <span>{t(item.l)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div
        className="flex flex-col gap-2 border-t p-3"
        style={{ borderColor: "var(--border-default)" }}
      >
        <button
          type="button"
          onClick={toggleLang}
          className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2 py-1.5 text-xs font-medium hover:bg-[rgba(10,94,215,.08)]"
          style={{ fontFamily: "var(--font-action)", color: "var(--text-muted)" }}
        >
          <SalisIcon name="Globe" size={14} />
          <span>{rtl ? "English" : "عربي"}</span>
        </button>
        <Link
          href="/login"
          className="box-border flex h-8 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium"
          style={{ fontFamily: "var(--font-action)", color: "var(--salis-orange)" }}
        >
          <SalisIcon name="LogOut" size={16} />
          <span>{t("Logout")}</span>
        </Link>
      </div>
    </aside>
  );
}
