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
 * request. This stays on until the next full page load (e.g. after sign-in).
 */
let anonymousFallback = false;
export function enableAnonymousFallback() {
  anonymousFallback = true;
}
export function isAnonymousFallbackEnabled() {
  return anonymousFallback;
}

type Listener = () => void;
const listeners = new Set<Listener>();

// A burst of in-flight requests can all fail at once when a session expires.
// Debounce so subscribers only react a single time per burst.
const NOTIFY_DEBOUNCE_MS = 500;
let lastNotified = 0;
// If a notification fires before any subscriber has attached (e.g. the first
// request resolves before the handler's effect runs), latch it and deliver to
// the next subscriber, so the event is never lost.
let pendingNotification = false;

/** Notifies subscribers that a request indicated the session has expired. */
export function notifySessionExpired() {
  const now = Date.now();
  if (now - lastNotified < NOTIFY_DEBOUNCE_MS) {
    return;
  }
  lastNotified = now;
  if (listeners.size === 0) {
    pendingNotification = true;
    return;
  }
  listeners.forEach((listener) => listener());
}

/**
 * Subscribes to session-expiry notifications.
 * Returns an unsubscribe function.
 */
export function subscribeSessionExpired(listener: Listener) {
  listeners.add(listener);
  if (pendingNotification) {
    pendingNotification = false;
    listener();
  }
  return () => {
    listeners.delete(listener);
  };
}
