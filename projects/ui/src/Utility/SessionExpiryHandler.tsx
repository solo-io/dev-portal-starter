import { useContext, useEffect, useRef } from "react";
import { subscribeSessionExpired } from "../Apis/sessionExpiry";
import { AuthContext, useIsLoggedIn } from "../Context/AuthContext";

/**
 * Listens for detected session expiry (from the central fetch wrapper) and
 * tells `AuthContext` to react.
 *
 * The reaction is guarded to sessions that were actually established: an
 * anonymous user on a public portal may get a 401 from `/me`, which we must
 * NOT treat as an expiry (otherwise we'd toast/prompt users who were never
 * signed in). `isLoggedIn` is read through a ref so the subscription callback
 * always sees the latest value without re-subscribing.
 */
const SessionExpiryHandler = () => {
  const { onSessionExpired } = useContext(AuthContext);
  const isLoggedIn = useIsLoggedIn();

  const isLoggedInRef = useRef(isLoggedIn);
  isLoggedInRef.current = isLoggedIn;

  useEffect(() => {
    return subscribeSessionExpired(() => {
      if (isLoggedInRef.current) {
        onSessionExpired();
      }
    });
  }, [onSessionExpired]);

  return null;
};

export default SessionExpiryHandler;
