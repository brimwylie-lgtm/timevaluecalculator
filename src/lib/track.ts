// Lightweight analytics wrapper around the Google Analytics gtag global.
// Safe to call on the server (during SSR) — it's a no-op when window is absent.
// Safe to call when GA isn't loaded — also a no-op.
// Defined event names and parameter shapes live in one place for consistency.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Allowed event names. Adding a new event?  Add it here so TypeScript catches typos.
type EventName =
  | 'calc_started'
  | 'calc_completed'
  | 'share_clicked';

// Allowed share platforms — keeps naming consistent across call sites.
export type SharePlatform =
  | 'twitter'
  | 'reddit'
  | 'linkedin'
  | 'whatsapp'
  | 'copy'
  | 'native';

export type ShareContext = 'purchase' | 'result';

/**
 * Fire a GA event.  No-op if GA isn't loaded (e.g. during SSR, ad blockers, offline).
 */
export function track(
  eventName: EventName,
  params: Record<string, string | number> = {}
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
