import { useContext, useEffect } from "react";
import { useSWRConfig } from "swr";
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
import {
  doFetch,
  fetchJSON,
  useMultiSwrWithAuth,
  useSwrWithAuth,
} from "./utility";

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
// this is an admin endpoint
export function useListSubscriptionsForStatus(status: SubscriptionStatus) {
  const swrResponse = useSwrWithAuth<Subscription[] | ErrorMessageResponse>(
    `/subscriptions?status=${status}`
  );
  useEffect(() => {
    if (!!swrResponse.data && "message" in swrResponse.data) {
      // eslint-disable-next-line no-console
      console.warn(swrResponse.data.message);
    }
  }, [swrResponse]);
  return swrResponse;
}
export function useListSubscriptionsForApp(appId: string) {
  return useSwrWithAuth<Subscription[] | { message: string }>(
    `/apps/${appId}/subscriptions`
  );
}
const APP_SUBS_SWR_KEY = "app-subscriptions";
export function useListSubscriptionsForApps(apps: App[]) {
  const skipFetching = apps.length === 0;
  return useMultiSwrWithAuth<Subscription[] | { message: string }>(
    apps.map((app) => `/apps/${app.id}/subscriptions`),
    skipFetching ? null : APP_SUBS_SWR_KEY
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
    return res as App;
  };
  return useSWRMutation(`/teams/${teamId}/apps`, createApp);
}

// ------------------------ //
// Update App

type UpdateAppParams = MutationWithArgs<{
  appId: string;
  appTeamId: string;
  appName: string;
  appDescription: string;
}>;

export function useUpdateAppMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const updateApp = async (_url: string, { arg }: UpdateAppParams) => {
    const { appId, appTeamId, appName, appDescription } = arg;
    await fetchJSON(`/apps/${appId}`, {
      method: "PUT",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify({ name: appName, description: appDescription }),
    });
    mutate(TEAM_APPS_SWR_KEY);
    mutate(`/teams/${appTeamId}/apps`);
    mutate(`/apps/${appId}`);
  };
  return useSWRMutation("update-app", updateApp);
}

// ------------------------ //
// Update Team

type UpdateTeamParams = MutationWithArgs<{
  teamId: string;
  teamName: string;
  teamDescription: string;
}>;

export function useUpdateTeamMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const updateTeam = async (_url: string, { arg }: UpdateTeamParams) => {
    const { teamId, teamName, teamDescription } = arg;
    await fetchJSON(`/teams/${teamId}`, {
      method: "PUT",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify({ name: teamName, description: teamDescription }),
    });
    mutate(TEAMS_SWR_KEY);
    mutate(`/teams/${teamId}`);
  };
  return useSWRMutation("update-team", updateTeam);
}

// ------------------------ //
// Create App and Subscription

type CreateAppAndSubscriptionParams = MutationWithArgs<{
  appName: string;
  appDescription: string;
  appTeamId: string;
  apiProductId: string;
}>;

export function useCreateAppAndSubscriptionMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const createAppAndSubscription = async (
    _url: string,
    { arg }: CreateAppAndSubscriptionParams
  ) => {
    const { appName, appDescription, appTeamId, apiProductId } = arg;
    // Create the app
    const appRes: App = await fetchJSON(`/teams/${appTeamId}/apps`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify({ name: appName, description: appDescription }),
    });
    // Create the subscription
    await doFetch(`/apps/${appRes.id}/subscriptions`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify({ apiProductId }),
    });
    mutate(TEAM_APPS_SWR_KEY);
    mutate(`/teams/${appTeamId}/apps`);
    mutate(`/apps/${appRes.id}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(
    "create-app-and-subscription",
    createAppAndSubscription
  );
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
    mutate(`/apps/${appId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(`/apps/${appId}/subscriptions`, createApp);
}

// -------------------------------- //
// Approve/Reject/Delete Subscription

type AdminUpdateSubscriptionParams = MutationWithArgs<{
  subscription: Subscription;
}>;

export function useAdminApproveSubscriptionMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const approveSub = async (
    _: string,
    { arg }: AdminUpdateSubscriptionParams
  ) => {
    await doFetch(`/subscriptions/${arg.subscription.id}/approve`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(`/apps/${arg.subscription.applicationId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(`approve-subscription`, approveSub);
}

export function useAdminRejectSubscriptionMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const rejectSub = async (
    _: string,
    { arg }: AdminUpdateSubscriptionParams
  ) => {
    await doFetch(`/subscriptions/${arg.subscription.id}/reject`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(`/apps/${arg.subscription.applicationId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(`reject-subscription`, rejectSub);
}

export function useAdminDeleteSubscriptionMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const deleteSub = async (
    _: string,
    { arg }: AdminUpdateSubscriptionParams
  ) => {
    await doFetch(`/subscriptions/${arg.subscription.id}`, {
      method: "DELETE",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(`/apps/${arg.subscription.applicationId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(`delete-subscription`, deleteSub);
}
