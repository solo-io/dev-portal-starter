import { useContext, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { PortalAuthContext } from "../Context/PortalAuthContext";
import {
  ApiProductDetails,
  ApiProductSummary,
  ApiVersion,
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

async function fetchJSON(...args: Parameters<typeof fetch>) {
  return doFetch(...args).then((res) => res?.json());
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
  const { latestAccessToken } = useContext(PortalAuthContext);

  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return useSWR<T[]>(
    swrKey,
    () =>
      Promise.all(
        paths.map((path) =>
          fetchJSON(path, {
            headers: authHeaders,
          })
        )
      ),
    config ?? {}
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
const MEMBERS_SWR_KEY = "members";
export function useListMembersForTeam(teamId: string) {
  return useSwrWithAuth<Member[]>(`/teams/${teamId}/members`, MEMBERS_SWR_KEY);
}
export function useGetTeamDetails(id?: string) {
  return useSwrWithAuth<Team>(`/teams/${id}`);
}

// Api Products
export function useListApiProducts() {
  return useSwrWithAuth<ApiProductSummary[]>("/api-products");
}
export function useGetApiProductDetails(id?: string) {
  return useSwrWithAuth<ApiProductDetails>(`/api-products/${id}`);
}
export function useGetApiProductVersions(id?: string) {
  return useSwrWithAuth<ApiVersion[]>(`/api-products/${id}/versions`);
}

// Subscriptions
const SUBSCRIPTIONS_FILTERED_SWR_KEY = "subscriptions_filtered";
const SUBSCRIPTIONS_SWR_KEY = "subscriptions";
// this is an admin endpoint
export function useListSubscriptionsForStatus(status: SubscriptionStatus) {
  const swrResponse = useSwrWithAuth<Subscription[] | ErrorMessageResponse>(
    `/subscriptions?status=${status}`,
    SUBSCRIPTIONS_FILTERED_SWR_KEY
  );
  useEffect(() => {
    if (!!swrResponse.data && "message" in swrResponse.data) {
      // eslint-disable-next-line no-console
      console.warn(swrResponse.data.message);
    }
  }, [swrResponse]);
  return swrResponse;
}
// this is NOT an admin endpoint
export function useListSubscriptionsForApp(appId: string) {
  return useSwrWithAuth<Subscription[] | { message: string }>(
    `/apps/${appId}/subscriptions`,
    SUBSCRIPTIONS_SWR_KEY
  );
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
// Create Team Member

type AddTeamMemberParams = MutationWithArgs<{ email: string }>;

export function useAddTeamMemberMutation(teamId: string | undefined) {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const addTeamMember = async (url: string, { arg }: AddTeamMemberParams) => {
    if (!teamId) {
      // eslint-disable-next-line no-console
      console.error("Tried to add a team member without a teamId.");
      throw new Error();
    }
    const res = await fetchJSON(url, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(MEMBERS_SWR_KEY);
    return res as Member;
  };
  return useSWRMutation(`/teams/${teamId}/members`, addTeamMember);
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
    await doFetch(url, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(SUBSCRIPTIONS_SWR_KEY);
    mutate(SUBSCRIPTIONS_FILTERED_SWR_KEY);
  };
  return useSWRMutation(`/apps/${appId}/subscriptions`, createApp);
}
