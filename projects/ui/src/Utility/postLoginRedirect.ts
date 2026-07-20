/**
 * Deep-link-after-login support.
 *
 * Login involves a full-page round trip to the identity provider (and, for BFF
 * deployments, through the gateway's ExtAuth), which always lands the browser
 * back on a default location ("/") rather than the page the user was on. The
 * intended route can't be carried reliably through that redirect chain — for
 * BFF, ExtAuth owns the authorization-code round trip and the final redirect,
 * and threading a caller-supplied return URL through a server handler would be
 * an open-redirect risk.
 *
 * Instead we keep the intended route entirely client-side: capture it in
 * `sessionStorage` just before starting login, then restore it once the browser
 * lands back on the app. `sessionStorage` survives the cross-origin excursion to
 * the IdP and back (it is scoped to the tab, not cleared by navigating away and
 * returning). Because the value never leaves the browser, there is no
 * server-side redirect to exploit; we still validate it as a relative in-app
 * path on restore as defense-in-depth.
 */

const STORAGE_KEY = "gloo-platform-portal-post-login-redirect";

/**
 * A safe restore target is a relative in-app path: it must start with a single
 * "/". Rejecting "//host" (protocol-relative) and backslashes (which some
 * browsers normalize to "/") prevents the stored value from redirecting to
 * another origin.
 */
function isSafeInAppPath(path: string | null): path is string {
  return (
    !!path &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\")
  );
}

/**
 * True when the current URL is an in-flight auth-code callback (it carries the
 * `?code=` that the PKCE exchange in `HeaderSectionLoggedOut` consumes). Such a
 * URL must be neither captured as a restore target nor navigated away from
 * before the exchange has run.
 */
export function isAuthCodeCallbackUrl() {
  return new URLSearchParams(window.location.search).has("code");
}

/**
 * Records the current in-app location to return to after login. Call this
 * immediately before redirecting to the IdP. The home page is skipped (the
 * post-login landing is already "/"), as is the in-flight auth-code callback
 * URL.
 */
export function capturePostLoginLocation() {
  const { pathname, search, hash } = window.location;
  if (pathname === "/" || isAuthCodeCallbackUrl()) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, pathname + search + hash);
}

/**
 * Returns the captured post-login location and clears it, or `null` if there is
 * none (or it fails validation). Safe to call on every boot; returns `null`
 * unless a login was just started from a non-home route.
 */
export function consumePostLoginLocation(): string | null {
  const target = sessionStorage.getItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  return isSafeInAppPath(target) ? target : null;
}
