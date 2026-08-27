import { useEffect, useState } from "react";

/** Tailwind's `sm` breakpoint — below it the mobile design files apply. */
export const MOBILE_QUERY = "(max-width: 639px)";

export function useMediaQuery(query: string) {
  // Read synchronously on first render so the correct layout is painted
  // immediately instead of flashing the desktop shell on a phone.
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY);
}
