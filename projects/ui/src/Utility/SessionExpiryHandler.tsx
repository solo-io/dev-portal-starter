import { useContext, useEffect, useRef } from "react";
import {
  enableAnonymousFallback,
  subscribeSessionExpired,
} from "../Apis/sessionExpiry";
import { AuthContext } from "../Context/AuthContext";
import { sessionExpiredBehavior } from "../user_variables.tmplr";
import { startLogin } from "./loginRedirect";

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
 * Detection only fires on a redirect-to-login or 401, which a validly
 * authenticated request never produces — so there is no need to gate on prior
 * login state, and this also handles a fresh load with an already-dead session.
 * A ref guards against re-reacting: the revalidation the fallback triggers makes
 * authed requests (e.g. `/me`) redirect again, which would otherwise loop.
 */
const SessionExpiryHandler = () => {
  const { clearSession } = useContext(AuthContext);
  const handledRef = useRef(false);

  useEffect(() => {
    return subscribeSessionExpired(() => {
      if (handledRef.current) {
        return;
      }
      handledRef.current = true;
      if (sessionExpiredBehavior === "prompt-login") {
        startLogin();
        return;
      }
      // "anonymous" behavior: drop the dead cookie and re-fetch so public
      // content loads, and evict cached authed data so the UI re-derives to
      // anonymous.
      enableAnonymousFallback();
      clearSession();
    });
  }, [clearSession]);

  return null;
};

export default SessionExpiryHandler;
