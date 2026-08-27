import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Separator } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { useTranslate } from "@/lib/i18n";

/** Matches the design's initial `secs: 1790` (29:50). */
const LOCK_DURATION_SECONDS = 1790;

const REFERENCE_ID = "LK-2026-4471";
const FAILED_ATTEMPTS = 5;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function useCountdown(from: number) {
  const [remaining, setRemaining] = useState(from);

  useEffect(() => {
    // Derive each tick from a fixed deadline rather than decrementing a counter:
    // browsers throttle setInterval in background tabs, so a decrementing
    // countdown silently falls behind wall-clock time.
    const deadline = Date.now() + from * 1000;

    const id = setInterval(() => {
      const secondsLeft = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(secondsLeft);
      if (secondsLeft === 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [from]);

  return remaining;
}

/**
 * Account Locked — ports `AccountLocked.dc.html` and `AccountLocked.Mobile.dc.html`.
 *
 * The two design files differ only in scale and in the mobile variant dropping
 * the second background blob, so they collapse into one mobile-first component
 * whose `sm:` variants carry the desktop values.
 */
export default function AccountLocked() {
  const { t, rtl } = useTranslate();
  const remaining = useCountdown(LOCK_DURATION_SECONDS);

  const labels = {
    reference: rtl ? "رقم المرجع" : "Reference ID",
    attempts: rtl ? "محاولات فاشلة" : "Failed Attempts",
    unlocksIn: rtl ? "إلغاء القفل خلال" : "Unlocks in",
  };

  return (
    <div
      data-screen-label="Account-Locked"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4"
      style={{ background: "var(--bg-page)", fontFamily: "var(--font-ui)" }}
    >
      {/* Decorative wash. The blue blob is desktop-only in the designs. */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full blur-[48px] sm:-bottom-[100px] sm:-right-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[64px]"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,.08), transparent 65%)" }}
        />
        <div
          className="absolute -left-[100px] -top-[100px] hidden h-[400px] w-[400px] rounded-full blur-[64px] sm:block"
          style={{ background: "radial-gradient(circle, rgba(10,94,215,.06), transparent 65%)" }}
        />
      </div>

      <div className="animate-salis-fade-up relative z-10 flex w-full flex-col items-center gap-[18px] text-center sm:max-w-[420px] sm:gap-5 sm:p-4">
        {/* Vault icon */}
        <div className="animate-salis-shake relative">
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-[20px] border-2 sm:h-24 sm:w-24 sm:rounded-3xl"
            style={{
              background: "rgba(249,115,22,.08)",
              borderColor: "rgba(249,115,22,.15)",
            }}
          >
            <SalisIcon
              name="Lock"
              size={36}
              className="h-[30px] w-[30px] sm:h-9 sm:w-9"
              style={{ color: "var(--salis-orange)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-extrabold sm:h-6 sm:w-6 sm:text-xs"
              style={{
                insetInlineEnd: -6,
                background: "var(--salis-orange)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(249,115,22,.4)",
              }}
            >
              !
            </div>
          </div>
        </div>

        <div>
          <h1
            className="m-0 text-[22px] font-black sm:text-2xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
          >
            {t("Account Locked")}
          </h1>
          <p
            className="mb-0 mt-2 text-[13px] leading-normal sm:text-sm"
            style={{ fontFamily: "var(--font-action)", color: "var(--text-muted)" }}
          >
            {t("Your account has been locked for security reasons.")}
          </p>
        </div>

        {/* Details card */}
        <div
          className="flex w-full flex-col gap-2.5 rounded-xl border p-3.5 sm:p-4"
          style={{
            background: "var(--surface-card)",
            borderColor: "var(--border-default)",
          }}
        >
          <div className="flex items-center justify-between text-xs sm:text-[13px]">
            <span style={{ color: "var(--text-muted)" }}>{labels.reference}</span>
            <span
              dir="ltr"
              className="font-semibold"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-heading)" }}
            >
              {REFERENCE_ID}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs sm:text-[13px]">
            <span style={{ color: "var(--text-muted)" }}>{labels.attempts}</span>
            {/* The dots carry the count visually; expose it as text for assistive tech. */}
            <div className="flex gap-[3px] sm:gap-1" role="img" aria-label={String(FAILED_ATTEMPTS)}>
              {Array.from({ length: FAILED_ATTEMPTS }, (_, i) => (
                <span
                  key={i}
                  className="h-[7px] w-[7px] rounded-full sm:h-2 sm:w-2"
                  style={{ background: "var(--salis-orange)" }}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs sm:text-[13px]">
            <span style={{ color: "var(--text-muted)" }}>{labels.unlocksIn}</span>
            <span
              dir="ltr"
              /* Ticks once a second — announcing every tick would flood a screen
                 reader, so the value is exposed as a static label instead. */
              aria-hidden="true"
              className="animate-salis-pulse font-bold"
              style={{ fontFamily: "var(--font-mono)", color: "var(--salis-orange)" }}
            >
              {formatCountdown(remaining)}
            </span>
          </div>
        </div>

        <div className="flex w-full gap-2.5">
          <Link
            to="/login"
            className="inline-flex h-[50px] flex-1 items-center justify-center rounded-lg border-[1.5px] text-sm font-medium no-underline sm:h-12"
            style={{
              borderColor: "var(--border-strong)",
              background: "none",
              color: "var(--text-body)",
              fontFamily: "var(--font-action)",
            }}
          >
            {t("Back to Sign In")}
          </Link>
          <button
            type="button"
            className="inline-flex h-[50px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-none text-sm font-semibold sm:h-12"
            style={{
              background: "var(--salis-orange)",
              color: "#fff",
              fontFamily: "var(--font-action)",
              boxShadow: "0 4px 12px rgba(249,115,22,.3)",
            }}
          >
            <SalisIcon name="Headphones" size={16} />
            {t("Contact Support")}
          </button>
        </div>
      </div>
    </div>
  );
}
