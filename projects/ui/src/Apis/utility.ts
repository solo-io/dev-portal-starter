import { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../Context/AuthContext";
import { ErrorMessageResponse } from "./api-types";
import {
  SessionExpiredError,
  isAnonymousFallbackEnabled,
  notifySessionExpired,
} from "./sessionExpiry";

let _portalServerURL = insertedEnvironmentVariables?.VITE_PORTAL_SERVER_URL;
if (_portalServerURL === undefined) {
  _portalServerURL = import.meta.env.VITE_PORTAL_SERVER_URL;
}
if (
  _portalServerURL &&
  typeof _portalServerURL === "string" &&
  _portalServerURL.at(-1) === "/"
) {
  // This allows the VITE_PORTAL_SERVER_URL env variable to work with or without a trailing "/"
  _portalServerURL = _portalServerURL.substring(0, _portalServerURL.length - 1);
}
export const portalServerURL: string = _portalServerURL ?? "/v1";

async function doFetch(...args: Parameters<typeof fetch>) {
  if (typeof args[0] !== "string") return;
  let url =
    args[0].substring(0, 4) === "http" ? args[0] : portalServerURL + args[0];
  const newArgs: typeof args = [
    url,
    {
      ...args[1],
      // Don't let the browser silently follow a gateway's redirect to a login
      // page. With "manual", a redirected request comes back as an opaque
      // redirect (type "opaqueredirect", status 0) that we can detect, instead
      // of the browser following it and resolving to login-page HTML (or
      // failing CORS when the IdP is a different origin). See
      // `isSessionExpiredResponse`.
      redirect: "manual",
      // After falling back to anonymous browsing, omit the dead session cookie
      // so the gateway serves public content instead of redirecting to login.
      ...(isAnonymousFallbackEnabled()
        ? { credentials: "omit" as RequestCredentials }
        : {}),
      headers: {
        ...args[1]?.headers,
        "Content-Type": "application/json",
      },
    },
  ];
  return fetch(...newArgs);
}

/**
 * Detects whether a response indicates the user's (server-side) session is
 * gone — i.e. the gateway redirected the request to a login page, or rejected
 * it as unauthorized. This is kept intentionally conservative (auth-shaped
 * signals only): a generic network failure rejects `fetch` with a `TypeError`
 * and never reaches here, so a transient blip won't be treated as an expiry.
 */
export function isSessionExpiredResponse(res: Response | undefined) {
  if (!res) {
    return false;
  }
  // A redirect we asked the browser not to follow (see the "manual" redirect
  // mode in `doFetch`). This is the primary signal for a gateway 302 -> login
  // page, and works regardless of whether the login page is cross-origin.
  if (res.type === "opaqueredirect" || res.redirected) {
    return true;
  }
  // The server explicitly rejected the request as unauthorized.
  if (res.status === 401) {
    return true;
  }
  // A login page returned directly as HTML where we expected JSON. (Note: the
  // portal API base URL may legitimately be a different origin, so we do NOT
  // treat a cross-origin response URL on its own as an expiry — that signal is
  // already covered by the opaque redirect above.)
  const contentType = res.headers.get("content-type") ?? "";
  if (res.ok && contentType.includes("text/html")) {
    return true;
  }
  return false;
}

/**
 * This fetches and tries to parse the response into JSON.
 * It returns successfully if the response is in the 200-299 status code range
 * (even if there is no JSON in the response body).
 */
export async function fetchJSON(...args: Parameters<typeof fetch>) {
  const res = await doFetch(...args);
  // If the session has expired, the gateway redirects the request to a login
  // page (or rejects it as unauthorized). Surface this as a distinct error and
  // notify subscribers (AuthContext) rather than returning unusable login HTML.
  if (isSessionExpiredResponse(res)) {
    notifySessionExpired();
    throw new SessionExpiredError();
  }
  let errMessage = "";
  let resJSON: any;
  try {
    // We try to get the JSON but if if this fails, that's okay, because
    // some of the responses don't return JSON.
    resJSON = await res?.json();
    if (!res?.ok && "message" in resJSON) {
      errMessage = resJSON.message;
    }
  } catch {}
  // If there was an error but no 'message', make sure we still capture that.
  if (!res?.ok && !errMessage) {
    errMessage = `There was an error making the request to ${args[0]}`;
  }
  if (!!errMessage) {
    throw new Error(errMessage);
  }
  return resJSON ?? res;
}

/**
 * Returns `useSwr` with `fetchJson`, but adds the auth tokens
 * from the `PortalAuthContext` in the headers.
 *
 * To skip the request, set `swrKey` to `null`.
 */
export const useSwrWithAuth = <T>(
  path: string,
  swrKey?: string | null,
  config?: Parameters<typeof useSWR<T>>[2]
) => {
  const { latestAccessToken } = useContext(AuthContext);

  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return useSWR<T>(
    swrKey === undefined ? path : swrKey,
    (...args) => {
      return fetchJSON(path, {
        ...(args.length > 1 && !!args[1] ? args[1] : {}),
        // credentials: "include",
        // Removing "credentials: include", since the server's 'Access-Control-Allow-Origin' header is "*".
        // If this is kept in, there is a browser error:
        //   The value of the 'Access-Control-Allow-Origin' header in the response must not be
        //   the wildcard '*' when the request's credentials mode is 'include'
        headers: {
          ...(args.length > 1 && args[1].headers ? args[1].headers : {}),
          ...authHeaders,
        },
      });
    },
    { ...(config ?? {}) }
  );
};

/**
 *  This is the same as useSwrWithAuth, but works for an array of paths.
 * e.g.`["/teams/team-id-1/apps", "/teams/team-id-2/apps", ...]` will return:
 * `[getAppsReponseForTeam1, getAppsResponseForTeam2, ...]`
 *
 * The entire array of requests can be invalidated by mutating the `swrKey`.
 *
 * The return values must be of the same type.
 */
export const useMultiSwrWithAuth = <T>(
  paths: string[],
  swrKey: string | null,
  config?: Parameters<typeof useSWR<[]>>[2]
) => {
  const { latestAccessToken } = useContext(AuthContext);

  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return useSWR<(T | ErrorMessageResponse)[]>(
    swrKey,
    () =>
      Promise.all(
        paths.map(async (path) => {
          // This uses a try catch, because if an error is thrown here,
          // all the message responses get thrown out.
          try {
            return await fetchJSON(path, {
              headers: authHeaders,
            });
          } catch (message) {
            const errMsgRes: ErrorMessageResponse = {
              isError: true,
              message: JSON.stringify(message),
            };
            return errMsgRes;
          }
        })
      ),
    (config ?? {}) as any
  );
};
