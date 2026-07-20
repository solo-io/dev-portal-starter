import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  consumePostLoginLocation,
  isAuthCodeCallbackUrl,
} from "./postLoginRedirect";

/**
 * Restores the route the user was on before signing in (see
 * `postLoginRedirect.ts`). After a BFF login the gateway lands the browser back
 * on the app with a fresh session, so this runs on boot: if a location was
 * captured, navigate there once. (Consuming is self-latching — the stored
 * location is removed on first read — so a re-run is a no-op.)
 *
 * The PKCE auth-code callback (`?code=` in the URL) is skipped here — that flow
 * must exchange the code first, so it restores the location itself afterwards
 * (in `AuthContext`'s `onLogin`). Touching the URL before the exchange would
 * strip the code.
 */
const PostLoginRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthCodeCallbackUrl()) {
      return;
    }
    const target = consumePostLoginLocation();
    if (target) {
      navigate(target, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default PostLoginRedirectHandler;
