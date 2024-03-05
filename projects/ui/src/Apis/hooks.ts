import { useContext } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { PortalAuthContext } from "../Context/PortalAuthContext";
import {
  APIKey,
  APIProduct,
  APISchema,
  App,
  Member,
  Team,
  UsagePlan,
  User,
} from "./api-types";

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

async function fetchJSON(...args: Parameters<typeof fetch>) {
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
  return fetch(...newArgs).then((res) => res.json());
}

/**
 * Returns `useSwr` with `fetchJson`, but adds the auth tokens
 * from the `PortalAuthContext` in the headers.
 */
const useSwrWithAuth = <T>(
  path: string,
  config?: Parameters<typeof useSWR<T>>[2]
) => {
  const { latestAccessToken } = useContext(PortalAuthContext);

  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return useSWR<T>(
    path,
    (...args) => {
      return fetchJSON(args[0], {
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
 * e.g.`["/apps/team-id-1/", "/apps/team-id-2", ...]` will return:
 * `[getAppsReponseForTeam1, getAppsResponseForTeam2, ...]`
 *
 * The return values must be of the same type.
 */
const useMultiSwrWithAuth = <T>(
  paths: string[],
  config?: Parameters<typeof useSWR<T[]>>[2]
) => {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return useSWR<T[]>(
    paths,
    (...args) => {
      return Promise.all(
        args.map((a) =>
          fetchJSON(a[0], {
            ...(a.length > 1 && !!a[1] ? a[1] : {}),
            headers: {
              ...(a.length > 1 && a[1].headers ? a[1].headers : {}),
              ...authHeaders,
            },
          })
        )
      );
    },
    { ...(config ?? {}) }
  );
};

//
// Queries
//
export function useGetCurrentUser() {
  return useSwrWithAuth<User>("/me");
}

export function useListApis() {
  return useSwrWithAuth<APIProduct[]>("/apis");
}
export function useListAppsForTeam(team: Team) {
  return useSwrWithAuth<App[]>(`/teams/${team.id}/apps`);
}
export function useListAppsForTeams(teams: Team[]) {
  return useMultiSwrWithAuth<App[]>(teams.map((t) => `/teams/${t.id}/apps`));
}
export function useListMembers(teamId: string) {
  return useSwrWithAuth<Member[]>(`/teams/${teamId}/members`);
}
export function useListTeams() {
  return useSwrWithAuth<Team[]>(`/teams`);
}
export function useGetApiDetails(id?: string) {
  return useSwrWithAuth<APISchema>(`/apis/${id}/schema`);
}

export function useListUsagePlans() {
  return useSwrWithAuth<UsagePlan[]>(`/usage-plans`);
}

export function useListApiKeys(usagePlan: string) {
  // const optionsString = !!usagePlans?.length
  //   ? `?usagePlans=${usagePlans.join(",")}`
  //   : "";

  // TODO: Add support for getting keys for multiple usage plans.
  // TODO: While also having the cache invalidation work (see useAddKeyMutation).
  return useSwrWithAuth<{ usagePlan: string; apiKeys: APIKey[] }[]>(
    `/api-keys?usagePlans=${usagePlan}`
  );
}

//
// Mutations
//

export function useCreateKeyMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();

  const createKey = async (
    url: string,
    {
      arg: { usagePlanName, apiKeyName },
    }: { arg: { usagePlanName: string; apiKeyName: string } }
  ) => {
    const authHeaders = {} as any;
    if (!!latestAccessToken) {
      authHeaders.Authorization = `Bearer ${latestAccessToken}`;
    }
    const res = await fetchJSON(url, {
      method: "POST",
      headers: authHeaders,
      credentials: "include",
      body: JSON.stringify({
        usagePlan: usagePlanName,
        apiKeyName,
        //customMetadata, // Coming soon
      }),
    });
    // TODO: Mutation should invalidate all usage plans that this api key is in.
    mutate(`/api-keys?usagePlans=${usagePlanName}`);
    return res as APIKey;
  };

  return useSWRMutation(`/api-keys`, createKey);
}

export function useDeleteKeyMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();

  const deleteKey = async (
    url: string,
    {
      arg: { apiKeyId, usagePlanName },
    }: { arg: { apiKeyId: string; usagePlanName: string } }
  ) => {
    const authHeaders = {} as any;
    if (!!latestAccessToken) {
      authHeaders.Authorization = `Bearer ${latestAccessToken}`;
    }
    try {
      await fetch(`${portalServerUrl}${url}/${apiKeyId}`, {
        method: "DELETE",
        headers: authHeaders,
        credentials: "include",
      });
      // TODO: Mutation should invalidate all usage plans that this api key is in.
      mutate(`/api-keys?usagePlans=${usagePlanName}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error((e as any)?.message);
    }
  };

  return useSWRMutation(`/api-keys`, deleteKey);
}
