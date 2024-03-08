import { useContext, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { PortalAuthContext } from "../Context/PortalAuthContext";
import {
  APIProduct,
  APISchema,
  ApiProductDetails,
  ApiProductSummary,
  App,
  ErrorMessageResponse,
  Member,
  Subscription,
  SubscriptionStatus,
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
 *
 * To skip the request, set `swrKey` to `null`.
 */
const useSwrWithAuth = <T>(
  path: string,
  swrKey?: string,
  config?: Parameters<typeof useSWR<T>>[2]
) => {
  const { latestAccessToken } = useContext(PortalAuthContext);

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
const useMultiSwrWithAuth = <T>(
  paths: string[],
  swrKey: string | null,
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

// User
export function useGetCurrentUser() {
  return useSwrWithAuth<User>("/me");
}

// Apps
export function useListAppsForTeam(team: Team) {
  return useSwrWithAuth<App[]>(`/teams/${team.id}/apps`);
}
const TEAM_APPS_SWR_KEY = "team-apps";
export function useListAppsForTeams(teams: Team[]) {
  const skipFetching = teams.length === 0;
  return useMultiSwrWithAuth<App[]>(
    teams.map((t) => `/teams/${t.id}/apps`),
    skipFetching ? null : TEAM_APPS_SWR_KEY
  );
}
export function useGetAppDetails(id?: string) {
  return useSwrWithAuth<App>(`/apps/${id}`);
}

// Teams
const TEAMS_SWR_KEY = "teams";
export function useListTeams() {
  return useSwrWithAuth<Team[]>(`/teams`, TEAMS_SWR_KEY);
}
export function useListMembers(teamId: string) {
  return useSwrWithAuth<Member[]>(`/teams/${teamId}/members`);
}
export function useGetTeamDetails(id?: string) {
  return useSwrWithAuth<Team>(`/teams/${id}`);
}

// APIs
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// TODO: Remove these old funtions and update API pages.
export function useListApis() {
  return useSwrWithAuth<APIProduct[]>("/apis");
}
export function useGetApiDetails(id?: string) {
  return useSwrWithAuth<APISchema>(`/apis/${id}/schema`);
}
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

// Api Products
export function useListApiProducts() {
  return useSwrWithAuth<ApiProductSummary[]>("/api-products");
}
export function useGetApiProductDetails(id?: string) {
  return useSwrWithAuth<ApiProductDetails>(`/api-products/${id}`);
}

// Subscriptions
const SUBSCRIPTIONS_SWR_KEY = "subscriptions";
export function useListSubscriptionsForStatus(status: SubscriptionStatus) {
  const swrResponse = useSwrWithAuth<Subscription[] | ErrorMessageResponse>(
    `/subscriptions?status=${status}`,
    SUBSCRIPTIONS_SWR_KEY
  );
  useEffect(() => {
    if (!!swrResponse.data && "message" in swrResponse.data) {
      // eslint-disable-next-line no-console
      console.warn(swrResponse.data.message);
    }
  }, [swrResponse.data]);
  return swrResponse;
}

export function useListSubscriptionsForApp(appId: string) {
  const swrResponse = useSwrWithAuth<Subscription[] | ErrorMessageResponse>(
    `/apps/${appId}/subscriptions`,
    SUBSCRIPTIONS_SWR_KEY
  );
  useEffect(() => {
    if (!!swrResponse.data && "message" in swrResponse.data) {
      // eslint-disable-next-line no-console
      console.warn(swrResponse.data.message);
    }
  }, [swrResponse.data]);
  return swrResponse;
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
    mutate(TEAMS_SWR_KEY);
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
    mutate(TEAM_APPS_SWR_KEY);
    mutate(`/teams/${teamId}/apps`);
    return res as Team;
  };
  return useSWRMutation(`/teams/${teamId}/apps`, createApp);
}

// ------------------------ //
// Create Subscription

type CreateSubscriptionParams = MutationWithArgs<{
  apiProductId: string;
}>;

export function useCreateSubscriptionMutation(appId: string) {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const createApp = async (url: string, { arg }: CreateSubscriptionParams) => {
    if (!appId) {
      // eslint-disable-next-line no-console
      console.error("Tried to subscribe without an appId.");
      throw new Error();
    }
    const res = await fetchJSON(url, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(SUBSCRIPTIONS_SWR_KEY);
    return res as Team;
  };
  return useSWRMutation(`/apps/${appId}/subscription`, createApp);
}
