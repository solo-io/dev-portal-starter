import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { AccessTokensResponse } from "../Apis/api-types";
import { doAccessTokenRequest } from "../Utility/accessTokenRequest";
import { jwtDecode, parseJwt } from "../Utility/utility";
import { clientId, tokenEndpoint } from "../user_variables.tmplr";

//
// Types
//
interface AuthProviderProps {
  children?: any;
}
interface IAuthContext extends AuthProviderProps {
  isAdmin: boolean;
  // The id_token is used for identifying the user in the logout request.
  idToken: string | undefined;
  // The access_token is used for user claims (like "email").
  latestAccessToken: string | undefined;
  isLoggedIn: boolean;
  tokensResponse: AccessTokensResponse | undefined;
  onLogin: (newTokensResponse: AccessTokensResponse) => void;
  onLogout: () => void;
}

const LOCAL_STORAGE_TOKENS_KEY = "gloo-platform-portal-tokens";
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
    getTokensFromLocalStorageIfCurrentElseClear()
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
      // Set the tokens if they have not changed.
      setTokensResponse(latestTokens);
      // Mutate and match all swr keys to clear the cache.
      mutate(() => true, undefined, { revalidate: true });
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
            tokenEndpoint,
            clientId
          );
          setTokensResponse(res);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
        }
      },
      // Don't make this request more than once a second,
      // and do the refresh 5 seconds early.
      Math.max(1000, millisUntilExpires - 5000)
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
    if (!tokensResponse) {
      clearTokensApiCacheAndTimeout();
      return;
    }
    // When there is a tokens response, set the timeout to refresh the token.
    try {
      const justLoggedIn = !localStorage.getItem(LOCAL_STORAGE_TOKENS_KEY);
      localStorage.setItem(
        LOCAL_STORAGE_TOKENS_KEY,
        JSON.stringify(tokensResponse)
      );
      refreshTheToken(tokensResponse);
      // If we just logged in.
      if (justLoggedIn) {
        // Mutate and match all swr keys to clear the cache.
        mutate(() => true, undefined, {
          revalidate: true,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error((e as any)?.message);
      clearTokensApiCacheAndTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensResponse]);

  /**  Saves access tokens on login. */
  const onLogin = (newTokensResponse: AccessTokensResponse) => {
    setTokensResponse(newTokensResponse);
    navigate("/");
  };

  /**  Removes access tokens on logout and clears swr cache. */
  const onLogout = () => {
    setTokensResponse(undefined);
    toast.success("Logged out!");
  };

  const isAdmin = useMemo(() => {
    if (!tokensResponse?.access_token) {
      return false;
    }
    const accessTokenDecoded = jwtDecode(tokensResponse.access_token);
    return accessTokenDecoded.payload?.group === "admin";
  }, [tokensResponse]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isLoggedIn: !!tokensResponse?.access_token,
        latestAccessToken: tokensResponse?.access_token,
        idToken: tokensResponse?.id_token,
        tokensResponse,
        onLogin,
        onLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
