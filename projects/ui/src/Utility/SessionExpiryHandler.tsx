import { useContext, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  enableAnonymousFallback,
  subscribeSessionExpired,
} from "../Apis/sessionExpiry";
import {
  AuthContext,
  LOCAL_STORAGE_TOKENS_KEY,
  useIsLoggedIn,
  useIsSessionVerified,
} from "../Context/AuthContext";
import { sessionExpiredBehavior } from "../user_variables.tmplr";
import { startLogin } from "./loginRedirect";

// Timestamp of the last expiry-triggered login redirect. If another expiry
// fires within the window below of that attempt, the IdP round trip did not
// produce a working session (misconfiguration, IdP trouble, ...), and
// redirecting again would loop through the IdP forever. sessionStorage rather
// than a ref because the round trip is a full page (re)load.
const EXPIRY_LOGIN_ATTEMPT_KEY =
  "gloo-platform-portal-expiry-login-attempted-at";
const EXPIRY_LOGIN_LOOP_WINDOW_MS = 60_000;

function recentlyAttemptedExpiryLogin() {
  const attemptedAt = Number(
    sessionStorage.getItem(EXPIRY_LOGIN_ATTEMPT_KEY) ?? NaN
  );
  return (
    Number.isFinite(attemptedAt) &&
    Date.now() - attemptedAt < EXPIRY_LOGIN_LOOP_WINDOW_MS
  );
}

// Don't retry a silent token refresh more often than this: if a refresh
// "succeeds" but the gateway still rejects the requests, another expiry
// notification arrives immediately, and refreshing again would loop.
const REFRESH_ATTEMPT_MIN_INTERVAL_MS = 30_000;

const SESSION_EXPIRED_TOAST_ID = "session-expired";

/**
 * Listens for detected session expiry (from the central fetch wrapper) and
 * applies the deployment's configured `sessionExpiredBehavior`:
 *
 * - "anonymous" (default): fall back to anonymous browsing. We stop sending the
 *   dead session cookie and re-derive auth state, so the gateway serves public
 *   content instead of redirecting to login.
 * - "prompt-login": redirect to the IdP to sign in again (for fully-private
 *   portals, where there is no public content to fall back to).
 *
 * In PKCE deployments, an unauthorized response may just mean the access token
 * lapsed (e.g. the tab slept past the refresh timer) while the refresh token is
 * still valid — so a silent refresh is attempted before either behavior.
 *
 * Reacting is gated by the notification's reason: a redirect-to-login is
 * unambiguous (anonymous requests are never redirected on a mixed portal, and
 * on a fully-private one the redirect is the intended outcome), and is always
 * handled — including a fresh load with an already-dead session. A 401,
 * however, is also what an anonymous visitor gets from auth-required endpoints
 * (e.g. the boot-time `/me` on a mixed portal), so it only counts as expiry
 * while a session is actually established.
 * A ref guards against re-reacting: the revalidation the fallback triggers makes
 * authed requests (e.g. `/me`) redirect again, which would otherwise loop.
 */
const SessionExpiryHandler = () => {
  const { clearSession, tryRefreshTokens } = useContext(AuthContext);
  const isLoggedIn = useIsLoggedIn();
  const isSessionVerified = useIsSessionVerified();
  const handledRef = useRef(false);
  const lastRefreshAttemptRef = useRef(0);

  // A VERIFIED session (a `/me` that succeeded through the gateway) means any
  // earlier expiry-triggered login attempt worked; the next expiry is genuine
  // and may redirect again. Mere token presence isn't enough: right after an
  // auth-code exchange the tokens exist but the gateway may still reject them
  // (misconfiguration), and clearing the guard on that would re-arm the
  // redirect and loop through the IdP.
  useEffect(() => {
    if (isSessionVerified) {
      sessionStorage.removeItem(EXPIRY_LOGIN_ATTEMPT_KEY);
    }
  }, [isSessionVerified]);

  useEffect(() => {
    return subscribeSessionExpired(async (reason) => {
      // See the component doc: a 401 with no established session is an
      // anonymous visitor hitting an auth-required endpoint, not an expiry.
      if (reason === "unauthorized" && !isLoggedIn) {
        return;
      }
      if (handledRef.current) {
        return;
      }
      handledRef.current = true;

      if (
        Date.now() - lastRefreshAttemptRef.current >
        REFRESH_ATTEMPT_MIN_INTERVAL_MS
      ) {
        lastRefreshAttemptRef.current = Date.now();
        if (await tryRefreshTokens()) {
          // The session is alive after all; stay ready for a real expiry.
          handledRef.current = false;
          return;
        }
      }

      const fallBackToAnonymous = () => {
        toast("Your session has expired.", { id: SESSION_EXPIRED_TOAST_ID });
        enableAnonymousFallback();
        clearSession();
      };

      if (sessionExpiredBehavior === "prompt-login") {
        if (recentlyAttemptedExpiryLogin()) {
          // eslint-disable-next-line no-console
          console.warn(
            "The session expired again right after a re-login attempt; " +
              "falling back to anonymous browsing instead of redirecting again."
          );
          fallBackToAnonymous();
          return;
        }
        sessionStorage.setItem(EXPIRY_LOGIN_ATTEMPT_KEY, String(Date.now()));
        toast("Your session has expired. Signing you in again…", {
          id: SESSION_EXPIRED_TOAST_ID,
        });
        // Drop the dead tokens (PKCE) before leaving, so the boot on return
        // starts logged out and actually processes the auth-code callback —
        // with stale tokens still stored, the app renders as logged in, never
        // exchanges the ?code=, and re-triggers this redirect in a loop. The
        // storage key is removed directly rather than via clearSession(): the
        // React teardown a state clear schedules also wipes the PKCE
        // verifier/state, racing the fresh ones startLogin() is about to
        // write.
        localStorage.removeItem(LOCAL_STORAGE_TOKENS_KEY);
        try {
          await startLogin();
          return;
        } catch (e) {
          // e.g. the PKCE flow needs a secure context for the crypto APIs.
          // eslint-disable-next-line no-console
          console.error(
            "Redirecting to sign-in failed; falling back to anonymous browsing.",
            e
          );
        }
      }

      // "anonymous" behavior: drop the dead cookie and re-fetch so public
      // content loads, and evict cached authed data so the UI re-derives to
      // anonymous.
      fallBackToAnonymous();
    });
    // The subscription is cheap to re-establish, and `pendingReason` in
    // sessionExpiry.ts latches any notification that fires between
    // unsubscribe and resubscribe, so keying on these values is lossless.
  }, [clearSession, tryRefreshTokens, isLoggedIn]);

  return null;
};

export default SessionExpiryHandler;
