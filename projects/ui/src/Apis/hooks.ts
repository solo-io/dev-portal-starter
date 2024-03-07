import { useContext } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { PortalAuthContext } from "../Context/PortalAuthContext";
import {
  APIProduct,
  APISchema,
  App,
  Member,
  Subscription,
  Team,
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
 * e.g.`["/teams/team-id-1/apps", "/teams/team-id-2/apps", ...]` will return:
 * `[getAppsReponseForTeam1, getAppsResponseForTeam2, ...]`
 *
 * The entire array of requests can be invalidated by mutating the `swrKey`.
 *
 * The return values must be of the same type.
 */
const useMultiSwrWithAuth = <T>(
  swrKey: string,
  paths: string[],
  config?: Parameters<typeof useSWR<T[]>>[2]
) => {
  return useSWR<T[]>(
    swrKey,
    () => Promise.all(paths.map((path) => fetchJSON(path))),
    { ...(config ?? {}) }
  );
};

//
// Queries
//
export function useGetCurrentUser() {
  return useSwrWithAuth<User>("/me");
}

// Apps
export function useListAppsForTeam(team: Team) {
  return useSwrWithAuth<App[]>(`/teams/${team.id}/apps`);
}
export function useListAppsForTeams(teams: Team[]) {
  return useMultiSwrWithAuth<App[]>(
    "team-apps",
    teams.map((t) => `/teams/${t.id}/apps`)
  );
}
export function useGetAppDetails(id?: string) {
  return useSwrWithAuth<App>(`/apps/${id}`);
}

// Teams
export function useListTeams() {
  return useSwrWithAuth<Team[]>(`/teams`);
}
export function useListMembers(teamId: string) {
  return useSwrWithAuth<Member[]>(`/teams/${teamId}/members`);
}
export function useGetTeamDetails(id?: string) {
  return useSwrWithAuth<Team>(`/teams/${id}`);
}

// APIs
export function useListApis() {
  return useSwrWithAuth<APIProduct[]>("/apis");
}
export function useGetApiDetails(id?: string) {
  return useSwrWithAuth<APISchema>(`/apis/${id}/schema`);
}

// Subscriptions
export function useListSubscriptions() {
  return useSwrWithAuth<Subscription[]>(`/subscriptions`);
}

//
// Mutations
//

const getLatestAuthHeaders = (latestAccessToken: string | undefined) => {
  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return authHeaders;
};

type MutationWithArgs<T> = { arg: T };

// ------------------------ //
// Create Team

type CreateTeamParams = MutationWithArgs<{ name: string; description: string }>;

export function useCreateTeamMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const createTeam = async (url: string, { arg }: CreateTeamParams) => {
    const res = await fetchJSON(url, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(`/teams`);
    return res as Team;
  };
  return useSWRMutation(`/teams`, createTeam);
}

// ------------------------ //
// Create App

type CreateAppParams = MutationWithArgs<{ name: string; description: string }>;

export function useCreateAppMutation(teamId: string | undefined) {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const createApp = async (url: string, { arg }: CreateAppParams) => {
    if (!teamId) {
      // eslint-disable-next-line no-console
      console.error("Tried to create an app without a teamId.");
      throw new Error();
    }
    const res = await fetchJSON(url, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate("team-apps");
    return res as Team;
  };
  return useSWRMutation(`/teams/${teamId}/apps`, createApp);
}
