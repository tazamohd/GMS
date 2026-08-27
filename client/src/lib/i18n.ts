import { useCallback } from "react";

import { AR } from "@/lib/gms-data";
import { useSalisPrefs } from "@/lib/salis-prefs";

/**
 * Mirrors the lookup every design file declares inline:
 *
 *   const t = s => lang === "ar" ? (AR[s] || s) : s;
 *
 * English is the source language, so an untranslated key renders its own text
 * rather than a missing-key placeholder.
 */
export function useTranslate() {
  const { rtl } = useSalisPrefs();

  const t = useCallback((source: string) => (rtl ? (AR[source] ?? source) : source), [rtl]);

  return { t, rtl };
}
