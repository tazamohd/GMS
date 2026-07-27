import { useState } from "react";
import { Link } from "wouter";

import { SalisIcon } from "@/components/salis-icon";
import { SalisSidebar } from "@/components/salis-sidebar";
import { SalisToggle } from "@/components/salis-toggle";
import { useTranslate } from "@/lib/i18n";
import { useSalisPrefs } from "@/lib/salis-prefs";
import {
  DEFAULT_TOGGLES,
  buildSettingsSections,
  type SettingsRow,
  type SettingsSection,
  type ToggleKey,
  type Toggles,
} from "@/lib/settings-sections";
import { useIsMobile } from "@/lib/use-media-query";

const BADGE_TONES = {
  blue: { background: "rgba(10,94,215,.1)", color: "var(--salis-blue)" },
  orange: { background: "rgba(249,115,22,.1)", color: "var(--salis-orange)" },
} as const;

const ARABIC_SCRIPT = /[؀-ۿ]/;

/**
 * Values like "8–18" and "30 min" contain no strong left-to-right character, so
 * an Arabic layout reorders them ("18–8", "min 30"). Pin those to LTR, but leave
 * genuinely translated values (e.g. "سنة واحدة") to inherit the page direction.
 */
function valueDirection(value: string): "ltr" | undefined {
  return ARABIC_SCRIPT.test(value) ? undefined : "ltr";
}

function RowControl({
  row,
  toggles,
  onToggle,
}: {
  row: SettingsRow;
  toggles: Toggles;
  onToggle: (key: ToggleKey) => void;
}) {
  const { control } = row;

  if (control.kind === "toggle") {
    return (
      <SalisToggle
        checked={toggles[control.key]}
        onChange={() => onToggle(control.key)}
        label={row.label}
      />
    );
  }

  if (control.kind === "value") {
    return (
      <span
        dir={valueDirection(control.value)}
        className="flex-shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium sm:px-3 sm:py-1.5 sm:text-[13px]"
        style={{
          color: "var(--text-heading)",
          background: "var(--surface-inset)",
          borderColor: "var(--border-default)",
        }}
      >
        {control.value}
      </span>
    );
  }

  return (
    <span
      className="flex-shrink-0 rounded-md px-2 py-[3px] text-[10px] font-semibold sm:px-2.5 sm:py-1 sm:text-[11px]"
      style={BADGE_TONES[control.tone]}
    >
      {control.label}
    </span>
  );
}

function SectionCard({
  section,
  toggles,
  onToggle,
}: {
  section: SettingsSection;
  toggles: Toggles;
  onToggle: (key: ToggleKey) => void;
}) {
  return (
    <section
      className="flex flex-col gap-3 rounded-xl border p-3.5 sm:gap-4 sm:p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span
          className="flex rounded-lg p-1.5 sm:rounded-[10px] sm:p-2"
          style={{ background: "rgba(10,94,215,.1)", color: "var(--salis-blue)" }}
        >
          <SalisIcon name={section.icon} size={18} className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
        </span>
        <h2
          className="m-0 text-[13px] font-bold sm:text-[15px]"
          style={{ color: "var(--text-heading)" }}
        >
          {section.title}
        </h2>
      </div>

      {section.items.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-2.5 border-b py-2.5 sm:gap-3 sm:py-3"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="min-w-0 flex-1">
            <p
              className="m-0 text-[13px] font-medium sm:text-sm"
              style={{ color: "var(--text-body)" }}
            >
              {row.label}
            </p>
            <p
              className="mb-0 mt-px text-[11px] sm:mt-0.5 sm:text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {row.desc}
            </p>
          </div>
          <RowControl row={row} toggles={toggles} onToggle={onToggle} />
        </div>
      ))}
    </section>
  );
}

function SaveButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[50px] w-full flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-none text-[15px] font-semibold sm:h-11 sm:max-w-[280px] sm:self-end sm:text-sm"
      style={{
        background: "var(--salis-gradient)",
        color: "#fff",
        fontFamily: "var(--font-action)",
        boxShadow: "var(--glow-blue)",
      }}
    >
      <SalisIcon name="Save" size={16} />
      {label}
    </button>
  );
}

/**
 * Settings — ports `AdvancedSettings.dc.html` and `AdvancedSettings.Mobile.dc.html`.
 *
 * The section content is shared; the two designs differ in shell (navigation rail
 * plus top bar on desktop, a compact header on mobile) so the shell is chosen at
 * runtime while the cards themselves scale with `sm:` variants.
 */
export default function AdvancedSettings() {
  const { t, rtl } = useTranslate();
  const { dark, toggleTheme } = useSalisPrefs();
  const isMobile = useIsMobile();
  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);

  const sections = buildSettingsSections({ t, rtl, isMobile });
  const onToggle = (key: ToggleKey) =>
    setToggles((current) => ({ ...current, [key]: !current[key] }));

  const themeIcon = dark ? "Sun" : "Moon";
  const themeLabel = dark ? "Switch to light theme" : "Switch to dark theme";

  const cards = sections.map((section) => (
    <SectionCard key={section.title} section={section} toggles={toggles} onToggle={onToggle} />
  ));

  if (isMobile) {
    return (
      <div
        data-screen-label="Settings-Mobile"
        className="flex min-h-screen flex-col"
        style={{ background: "var(--bg-page)", fontFamily: "var(--font-ui)" }}
      >
        <div
          className="flex items-center gap-2.5 border-b px-4 py-3.5"
          style={{ background: "var(--surface-sidebar)", borderColor: "var(--border-default)" }}
        >
          {/* The design returns to a settings index screen that was not provided;
              until it exists this falls back to the dashboard. */}
          <Link href="/" className="flex" style={{ color: "var(--text-muted)" }} aria-label="Back">
            <SalisIcon name={rtl ? "ChevronRight" : "ChevronLeft"} size={20} />
          </Link>
          <div className="flex-1">
            <h1
              className="m-0 text-[17px] font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
            >
              {t("Settings")}
            </h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent"
            style={{ color: "var(--text-muted)" }}
          >
            <SalisIcon name={themeIcon} size={16} />
          </button>
        </div>

        <div className="animate-salis-fade-up flex flex-1 flex-col gap-3.5 overflow-y-auto p-4">
          {cards}
          <SaveButton label={t("Save Changes")} />
        </div>
      </div>
    );
  }

  return (
    <div
      data-screen-label="Advanced-Settings"
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-page)", fontFamily: "var(--font-ui)" }}
    >
      <SalisSidebar activeItem="Settings" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex flex-shrink-0 items-center gap-3 border-b px-6"
          style={{
            height: "var(--h-topbar)",
            background: "var(--surface-sidebar)",
            borderColor: "var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex-1" />
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

        <main className="flex-1 overflow-auto">
          <div className="animate-salis-fade-up flex max-w-[900px] flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl opacity-30 blur-[12px]"
                  style={{ background: "var(--salis-blue)" }}
                />
                <div
                  className="relative flex rounded-2xl p-3"
                  style={{
                    background: "var(--salis-gradient)",
                    boxShadow: "0 20px 25px -5px rgba(10,94,215,.25)",
                    color: "#fff",
                  }}
                >
                  <SalisIcon name="Settings" size={28} />
                </div>
              </div>
              <div>
                <h1
                  className="m-0 text-[26px] font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
                >
                  {t("Settings")}
                </h1>
                <p className="mb-0 mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  {rtl ? "تكوين النظام" : "Configure your system"}
                </p>
              </div>
            </div>

            {cards}
            <SaveButton label={t("Save Changes")} />
          </div>
        </main>
      </div>
    </div>
  );
}
