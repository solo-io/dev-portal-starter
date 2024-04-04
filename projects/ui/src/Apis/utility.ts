import { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../Context/AuthContext";
import { ErrorMessageResponse } from "./api-types";

let _portalServerUrl = import.meta.env.VITE_PORTAL_SERVER_URL;
if (
  _portalServerUrl &&
  typeof _portalServerUrl === "string" &&
  _portalServerUrl.at(-1) === "/"
) {
  // This allows the VITE_PORTAL_SERVER_URL env variable to work with or without a trailing "/"
  _portalServerUrl = _portalServerUrl.substring(0, _portalServerUrl.length - 1);
}
export const portalServerUrl: string = _portalServerUrl ?? "/v1";

async function doFetch(...args: Parameters<typeof fetch>) {
  if (typeof args[0] !== "string") return;
  let url = portalServerUrl + args[0];
  const newArgs: typeof args = [
    url,
    {
      ...args[1],
      headers: {
        ...args[1]?.headers,
        // TODO: Could remove this once auth is working.
        ...(import.meta.env.VITE_AUTH_HEADER
          ? {
              Authorization: import.meta.env.VITE_AUTH_HEADER,
            }
          : {}),
        "Content-Type": "application/json",
      },
    },
  ];
  return fetch(...newArgs);
}

/**
 * This fetches and tries to parse the response into JSON.
 * It returns successfully if the response is in the 200-299 status code range
 * (even if there is no JSON in the response body).
 */
export async function fetchJSON(...args: Parameters<typeof fetch>) {
  const res = await doFetch(...args);
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
  swrKey?: string,
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

// /**
//  * TODO: This isn't used but could be useful in a refactor
//  */
// export const useSwrWithAuthOmitError = <T>(
//   ...args: Parameters<typeof useSwrWithAuth<T>>
// ) => {
//   const swrRes = useSwrWithAuth<T>(...args);
//   return { ...swrRes, data: omitErrorMessageResponse(swrRes.data) };
// };

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
              // TODO: This isn't used but could be useful in a refactor.
              // isError: true,
              message: JSON.stringify(message),
            };
            return errMsgRes;
          }
        })
      ),
    (config ?? {}) as any
  );
};
