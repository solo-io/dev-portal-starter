import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { consumePostLoginLocation } from "./postLoginRedirect";

/**
 * Restores the route the user was on before signing in (see
 * `postLoginRedirect.ts`). After a BFF login the gateway lands the browser back
 * on the app with a fresh session, so this runs on boot: if a location was
 * captured, navigate there once.
 *
 * The PKCE auth-code callback (`?code=` in the URL) is skipped here — that flow
 * must exchange the code first, so it restores the location itself afterwards
 * (in `AuthContext`'s `onLogin`). Touching the URL before the exchange would
 * strip the code.
 */
const PostLoginRedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;
    if (searchParams.has("code")) {
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
