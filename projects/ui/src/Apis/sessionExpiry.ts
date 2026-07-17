/**
 * Session-expiry signalling.
 *
 * `fetchJSON` (in ./utility.ts) runs at module scope, outside of React, so it
 * cannot touch auth state directly. When it detects that a request was answered
 * with a redirect-to-login or a 401 (i.e. the server-side session is gone), it
 * calls `notifySessionExpired()`. `AuthContext` subscribes via
 * `subscribeSessionExpired` and decides how to react (clear auth state, and
 * optionally prompt the user to sign in again).
 */

/**
 * Thrown by `fetchJSON` when a request indicates the session has expired, so
 * SWR error state for that request is distinguishable from a generic failure.
 */
export class SessionExpiredError extends Error {
  constructor(message = "The session has expired.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

/**
 * Once a session is known to be dead and the deployment falls back to anonymous
 * browsing, requests are re-issued without the (now invalid) session cookie so
 * the gateway treats them as anonymous and returns public content, instead of
 * redirecting them to login. The stale cookie itself can't be removed from here
 * if it is httpOnly, but omitting credentials has the same effect on the
 * request. This stays on until the next full page load (e.g. after sign-in) —
 * deliberately, so a fresh login works normally. The flip side: a reload while
 * the dead cookie lingers costs one failed boot-time request (e.g. `/me`)
 * before expiry is re-detected and the fallback re-engages.
 */
let anonymousFallback = false;
export function enableAnonymousFallback() {
  anonymousFallback = true;
}
export function isAnonymousFallbackEnabled() {
  return anonymousFallback;
}

/**
 * What the response looked like. The distinction matters to subscribers:
 * a redirect-to-login is unambiguous (an anonymous request is never redirected
 * on a mixed portal), while a 401 is also what an anonymous visitor gets from
 * auth-required endpoints (e.g. the boot-time `/me`), so it only indicates
 * expiry when a session was actually established.
 */
export type SessionExpiryReason = "redirect" | "unauthorized";

type Listener = (reason: SessionExpiryReason) => void;
const listeners = new Set<Listener>();

// A burst of in-flight requests can all fail at once when a session expires.
// Debounce so subscribers only react a single time per burst.
const NOTIFY_DEBOUNCE_MS = 500;
let lastNotified = 0;
// If a notification fires before any subscriber has attached (e.g. the first
// request resolves before the handler's effect runs), latch it and deliver to
// the next subscriber, so the event is never lost.
let pendingReason: SessionExpiryReason | undefined;

/** Notifies subscribers that a request indicated the session has expired. */
export function notifySessionExpired(reason: SessionExpiryReason) {
  const now = Date.now();
  if (now - lastNotified < NOTIFY_DEBOUNCE_MS) {
    return;
  }
  lastNotified = now;
  if (listeners.size === 0) {
    pendingReason = reason;
    return;
  }
  listeners.forEach((listener) => listener(reason));
}

/**
 * Subscribes to session-expiry notifications.
 * Returns an unsubscribe function.
 */
export function subscribeSessionExpired(listener: Listener) {
  listeners.add(listener);
  if (pendingReason !== undefined) {
    const reason = pendingReason;
    pendingReason = undefined;
    listener(reason);
  }
  return () => {
    listeners.delete(listener);
  };
}
