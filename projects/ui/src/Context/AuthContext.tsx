import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { di } from "react-magnetic-di";
import { useNavigate } from "react-router";
import { mutate } from "swr";
import { AccessTokensResponse } from "../Apis/api-types";
import { useGetCurrentUser } from "../Apis/gg_hooks";
import { doAccessTokenRequest } from "../Utility/accessTokenRequest";
import { consumePostLoginLocation } from "../Utility/login/postLoginRedirect";
import { jwtDecode, parseJwt } from "../Utility/utility";

//
// Types
//
interface AuthProviderProps {
  children?: any;
}
interface IAuthContext extends AuthProviderProps {
  // The id_token is used for identifying the user in the logout request.
  idToken: string | undefined;
  // The access_token is used for user claims (like "email").
  latestAccessToken: string | undefined;
  tokensResponse: AccessTokensResponse | undefined;
  onLogin: (newTokensResponse: AccessTokensResponse) => void;
  onLogout: () => void;
  // Clears local tokens (PKCE) and evicts cached authed data (e.g. the `/me`
  // response) so `useIsLoggedIn` re-derives to anonymous. Used when an expired
  // session is detected (see `SessionExpiryHandler`).
  clearSession: () => void;
  // Attempts a silent access-token refresh using the locally stored
  // refresh_token (PKCE deployments only). Resolves true on success.
  tryRefreshTokens: () => Promise<boolean>;
}

export const LOCAL_STORAGE_TOKENS_KEY = "gloo-platform-portal-tokens";
export const LOCAL_STORAGE_AUTH_VERIFIER = "gloo-platform-portal-auth-verifier";
export const LOCAL_STORAGE_AUTH_STATE = "gloo-platform-portal-auth-state";

export const AuthContext = createContext({} as IAuthContext);

export const AuthContextProvider = (props: AuthProviderProps) => {
  const navigate = useNavigate();
  const [refreshTokenTimeout, setRefreshTokenTimeout] =
    useState<NodeJS.Timeout>();

  const clearTokensApiCacheAndTimeout = () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_VERIFIER);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_STATE);
    localStorage.removeItem(LOCAL_STORAGE_TOKENS_KEY);
    // Mutate and match all swr keys to clear the cache.
    mutate(() => true, undefined, { revalidate: true });
    // Stop refreshing the tokens.
    if (refreshTokenTimeout !== undefined) {
      clearTimeout(refreshTokenTimeout);
    }
  };

  const getTokensFromLocalStorageIfCurrentElseClear = () => {
    const existingTokens = localStorage.getItem(LOCAL_STORAGE_TOKENS_KEY);
    if (!!existingTokens) {
      const tokensJSON = JSON.parse(existingTokens) as AccessTokensResponse;
      //
      // Parse the access_token JWT to find when it expires.
      const parsedToken = parseJwt(tokensJSON.access_token);
      if (!parsedToken.exp) {
        throw new Error("No `exp` property found in the access_token JWT.");
      }
      const nowDate = new Date();
      const expiresDate = new Date(parsedToken.exp * 1000);
      const millisUntilExpires = expiresDate.getTime() - nowDate.getTime();
      // If it has expired, clear local data.
      if (millisUntilExpires <= 0) {
        clearTokensApiCacheAndTimeout();
      } else {
        // Else we can return it.
        return tokensJSON;
      }
    }
    return undefined;
  };

  const [tokensResponse, setTokensResponse] = useState(
    getTokensFromLocalStorageIfCurrentElseClear(),
  );

  // What the [tokensResponse] effect should do about cached API data once the
  // tokens it is reacting to have been committed — "reset" to discard and
  // refetch (the session identity changed), "retry" to re-run the queries
  // keeping their data in place (same user, fresher token).
  //
  // Refetching is deferred to that effect rather than done where the tokens are
  // set, because SWR's fetchers capture the Bearer token as of the last render:
  // a refetch fired alongside `setTokensResponse` still sends the token being
  // replaced, and gets rejected all over again.
  const pendingRevalidationRef = useRef<"reset" | "retry" | undefined>(
    undefined,
  );

  useEffect(() => {
    const onWindowFocus = () => {
      // If the localStorage tokens are valid, use them, else clear them.
      // Do this on every page focus so that it works across tabs/windows.
      const latestTokens = getTokensFromLocalStorageIfCurrentElseClear();
      if (latestTokens === undefined) {
        // Clear tokens state if we are not in a valid session here.
        if (tokensResponse !== undefined) {
          setTokensResponse(undefined);
        }
        return;
      }
      if (tokensResponse?.access_token === latestTokens.access_token) return;
      // Another tab changed the session, so adopt its tokens and drop the data
      // fetched for the previous one.
      pendingRevalidationRef.current = "reset";
      setTokensResponse(latestTokens);
    };
    window.addEventListener("focus", onWindowFocus);
    return () => {
      window.removeEventListener("focus", onWindowFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensResponse?.access_token, setTokensResponse]);

  /**
   * Calling this will refresh the access_token when it is expiring soon,
   * using the refresh_token in the access tokens response.
   * */
  const refreshTheToken = (tokensJSON: AccessTokensResponse) => {
    //
    // Parse the access_token JWT to find when it expires.
    const parsedToken = parseJwt(tokensJSON.access_token);
    if (!parsedToken.exp) {
      throw new Error("No `exp` property found in the access_token JWT.");
    }
    const nowDate = new Date();
    const expiresDate = new Date(parsedToken.exp * 1000);
    const millisUntilExpires = expiresDate.getTime() - nowDate.getTime();
    if (millisUntilExpires <= 0) {
      setTokensResponse(undefined);
      return;
    }
    // Set the timeout to request new tokens.
    const newRefreshTimeout = setTimeout(
      async () => {
        try {
          const res = await doAccessTokenRequest(
            { refresh_token: tokensJSON.refresh_token },
            "refresh_token",
          );
          setTokensResponse(res);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
        }
      },
      // Don't make this request more than once a second,
      // and do the refresh 5 seconds early.
      Math.max(1000, millisUntilExpires - 5000),
    );
    // Update the saved timeout
    if (refreshTokenTimeout !== undefined) {
      clearTimeout(refreshTokenTimeout);
    }
    setRefreshTokenTimeout(newRefreshTimeout);
  };

  // This reacts to the access token changes,
  // either clearing or saving locally stored data.
  useEffect(() => {
    // Read and reset on every run so a request can only apply to the tokens it
    // was made for.
    const pendingRevalidation = pendingRevalidationRef.current;
    pendingRevalidationRef.current = undefined;
    if (!tokensResponse) {
      clearTokensApiCacheAndTimeout();
      return;
    }
    // When there is a tokens response, set the timeout to refresh the token.
    try {
      const justLoggedIn = !localStorage.getItem(LOCAL_STORAGE_TOKENS_KEY);
      localStorage.setItem(
        LOCAL_STORAGE_TOKENS_KEY,
        JSON.stringify(tokensResponse),
      );
      refreshTheToken(tokensResponse);
      if (justLoggedIn || pendingRevalidation === "reset") {
        // Mutate and match all swr keys to clear the cache.
        mutate(() => true, undefined, {
          revalidate: true,
        });
      } else if (pendingRevalidation === "retry") {
        // Re-run the queries with the new token, keeping any cached data in
        // place while they revalidate.
        mutate(() => true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error((e as any)?.message);
      clearTokensApiCacheAndTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensResponse]);

  /**
   * Clears local tokens (PKCE) and evicts cached authed data so the app
   * re-derives to anonymous. Memoized so effect subscriptions keyed on it
   * (SessionExpiryHandler) don't churn every render.
   */
  const clearSession = useCallback(() => {
    if (tokensResponse !== undefined) {
      // PKCE: dropping the tokens fires the [tokensResponse] effect, whose
      // teardown already evicts the SWR cache — evicting here too would
      // force-revalidate every key twice back to back.
      setTokensResponse(undefined);
      return;
    }
    // OIDC-auth-code (BFF): there are no local tokens, so no state change will
    // fire the teardown effect; evict the cached authed data (e.g. the stale
    // `/me`) directly.
    mutate(() => true, undefined, { revalidate: true });
  }, [tokensResponse]);

  /**
   * Attempts a silent token refresh (PKCE deployments only — requires a
   * locally stored refresh_token; in OIDC-auth-code/BFF deployments there are
   * no local tokens and this resolves false immediately). Used when a request
   * is rejected as unauthorized: the access token may simply have lapsed (e.g.
   * the tab slept past the refresh timer) while the refresh token is still
   * valid, which shouldn't end the session.
   */
  const tryRefreshTokens = useCallback(async () => {
    const refreshToken = tokensResponse?.refresh_token;
    if (!refreshToken) {
      return false;
    }
    try {
      const res = await doAccessTokenRequest(
        { refresh_token: refreshToken },
        "refresh_token",
      );
      if (!res?.access_token) {
        return false;
      }
      // The queries that failed with the lapsed token are re-run by the
      // [tokensResponse] effect, once this token is the one they will send.
      pendingRevalidationRef.current = "retry";
      setTokensResponse(res);
      return true;
    } catch {
      return false;
    }
  }, [tokensResponse]);

  /**  Saves access tokens on login. */
  const onLogin = (newTokensResponse: AccessTokensResponse) => {
    setTokensResponse(newTokensResponse);
    // Return to the route the user started login from (PKCE lands back here with
    // the auth code), falling back to home. `replace` drops the `?code=` URL
    // from history. See postLoginRedirect.
    navigate(consumePostLoginLocation() ?? "/", { replace: true });
  };

  /**  Removes access tokens on logout and clears swr cache. */
  const onLogout = () => {
    setTokensResponse(undefined);
    toast.success("Logged out!");
  };

  return (
    <AuthContext.Provider
      value={{
        latestAccessToken: tokensResponse?.access_token,
        idToken: tokensResponse?.id_token,
        tokensResponse,
        onLogin,
        onLogout,
        clearSession,
        tryRefreshTokens,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

/**
 * True when the current identity request (`/me`) has succeeded — i.e. the
 * session is verified end-to-end against the gateway, not just present
 * client-side (contrast with `useIsLoggedIn`, which is also true on mere
 * token presence before any request has been validated).
 */
export function useIsSessionVerified() {
  di(useGetCurrentUser);
  const { data: user } = useGetCurrentUser();
  return !!user?.email || !!user?.username || !!user?.name;
}

/**
 * Since we support different authorization types, this is the way to tell if someone is logged in.
 */
export function useIsLoggedIn() {
  const { tokensResponse } = useContext(AuthContext);
  const isAccessTokenAuthLoggedIn = !!tokensResponse?.access_token;
  const isOidcAuthLoggedIn = useIsSessionVerified();
  return isAccessTokenAuthLoggedIn || isOidcAuthLoggedIn;
}

export function useIsAdmin() {
  di(useGetCurrentUser);
  const { tokensResponse } = useContext(AuthContext);
  const { data: user } = useGetCurrentUser();

  // Check if the isAdmin property is in the token.
  const isAdminTokensResponse = useMemo(() => {
    if (!tokensResponse?.access_token) {
      return false;
    }
    let accessTokenDecoded: ReturnType<typeof jwtDecode> | undefined;
    let idTokenDecoded: ReturnType<typeof jwtDecode> | undefined;
    try {
      accessTokenDecoded = jwtDecode(tokensResponse.access_token);
    } catch {}
    try {
      idTokenDecoded = jwtDecode(tokensResponse.id_token);
    } catch {}
    return (
      accessTokenDecoded?.payload?.group === "admin" ||
      idTokenDecoded?.payload?.group === "admin"
    );
  }, [tokensResponse]);

  // If there was no user, they can't be an admin.
  if (user === undefined) {
    return false;
  }
  // Use the portal server property if possible.
  if (user?.isAdmin !== undefined) {
    return user.isAdmin;
  }
  // Otherwise fall back to what is in the token.
  // This is used for older portal server versions (before the isAdmin property was added to /me).
  return !!isAdminTokensResponse;
}
