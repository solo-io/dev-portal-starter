import { useContext, useEffect, useMemo } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "../Context/AuthContext";
import { omitErrorMessageResponse } from "../Utility/utility";
import {
  ApiKey,
  ApiProductDetails,
  ApiProductSummary,
  ApiVersion,
  App,
  Member,
  Subscription,
  SubscriptionStatus,
  SubscriptionsListError,
  Team,
  User,
  isSubscriptionsListError,
} from "./api-types";
import { fetchJSON, useMultiSwrWithAuth, useSwrWithAuth } from "./utility";

//
// region Queries
//

// region User
export function useGetCurrentUser() {
  return useSwrWithAuth<User>("/me");
}

// region Apps + API Keys
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
export function useListFlatAppsForTeamsOmitErrors(teams: Team[]) {
  // This flattens the apps for teams result, in cases where we don't
  // need the mapped team data.
  const swrRes = useListAppsForTeams(teams);
  const data = useMemo(
    () =>
      (swrRes.data
        ?.flat()
        .filter((app) => !!omitErrorMessageResponse(app)) as App[]) ?? [],
    [swrRes.data]
  );
  return { ...swrRes, data };
}
export function useGetAppDetails(id?: string) {
  return useSwrWithAuth<App>(`/apps/${id}`);
}
export function useListApiKeysForApp(appId: string) {
  return useSwrWithAuth<ApiKey[]>(`/apps/${appId}/api-keys`);
}

// region Teams
const TEAMS_SWR_KEY = "teams";
export function useListTeams() {
  return useSwrWithAuth<Team[]>(`/teams`);
}
export function useListMembersForTeam(teamId: string) {
  return useSwrWithAuth<Member[]>(`/teams/${teamId}/members`);
}
export function useGetTeamDetails(id?: string) {
  return useSwrWithAuth<Team>(`/teams/${id}`);
}

// region API Products
export function useListApiProducts() {
  return useSwrWithAuth<ApiProductSummary[]>("/api-products");
}
export function useGetApiProductDetails(id?: string) {
  return useSwrWithAuth<ApiProductDetails>(`/api-products/${id}`);
}
export function useGetApiProductVersions(id?: string) {
  return useSwrWithAuth<ApiVersion[]>(`/api-products/${id}/versions`);
}

// region Subscriptions
// this is an admin endpoint
export function useListSubscriptionsForStatus(status: SubscriptionStatus) {
  const swrResponse = useSwrWithAuth<Subscription[] | SubscriptionsListError>(
    `/subscriptions?status=${status}`
  );
  useEffect(() => {
    if (isSubscriptionsListError(swrResponse.data)) {
      // eslint-disable-next-line no-console
      console.warn((swrResponse.data as SubscriptionsListError).message);
    }
  }, [swrResponse]);
  return swrResponse;
}
export function useListSubscriptionsForApp(appId: string) {
  const swrResponse = useSwrWithAuth<Subscription[] | SubscriptionsListError>(
    `/apps/${appId}/subscriptions`
  );
  useEffect(() => {
    if (isSubscriptionsListError(swrResponse.data)) {
      // eslint-disable-next-line no-console
      console.warn((swrResponse.data as SubscriptionsListError).message);
    }
  }, [swrResponse]);
  return swrResponse;
}
const APP_SUBS_SWR_KEY = "app-subscriptions";
export function useListSubscriptionsForApps(apps: App[]) {
  const skipFetching = apps.length === 0;
  return useMultiSwrWithAuth<Subscription[] | SubscriptionsListError>(
    apps.map((app) => `/apps/${app.id}/subscriptions`),
    skipFetching ? null : APP_SUBS_SWR_KEY
  );
}

//
// region Mutations
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
// region Create Team

type CreateTeamParams = MutationWithArgs<{ name: string; description: string }>;

export function useCreateTeamMutation() {
  const { latestAccessToken } = useContext(AuthContext);
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
// region Create Team Member

type AddTeamMemberParams = MutationWithArgs<{ email: string; teamId: string }>;

export function useAddTeamMemberMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const addTeamMember = async (_url: string, { arg }: AddTeamMemberParams) => {
    const res = await fetchJSON(`/teams/${arg.teamId}/members`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
    mutate(`/teams/${arg.teamId}/members`);
    return res as Member;
  };
  return useSWRMutation(`add-team-member`, addTeamMember);
}

// ------------------------ //
// region Remove Team Member

type AdminRemoveTeamMemberParams = MutationWithArgs<{
  teamId: string;
  userId: string;
}>;

export function useRemoveTeamMemberMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const removeTeamMember = async (
    _url: string,
    { arg }: AdminRemoveTeamMemberParams
  ) => {
    const res = await fetchJSON(`/teams/${arg.teamId}/members/${arg.userId}`, {
      method: "DELETE",
      headers: getLatestAuthHeaders(latestAccessToken),
    });
    mutate(`/teams/${arg.teamId}/members`);
    return res as Member;
  };
  return useSWRMutation(`remove-team-member`, removeTeamMember);
}

// ------------------------ //
// region Create App

type CreateAppParams = MutationWithArgs<{ name: string; description: string }>;

export function useCreateAppMutation(teamId: string | undefined) {
  const { latestAccessToken } = useContext(AuthContext);
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
// region Update App

type UpdateAppParams = MutationWithArgs<{
  appId: string;
  appTeamId: string;
  appName: string;
  appDescription: string;
}>;

export function useUpdateAppMutation() {
  const { latestAccessToken } = useContext(AuthContext);
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
// region Update Team

type UpdateTeamParams = MutationWithArgs<{
  teamId: string;
  teamName: string;
  teamDescription: string;
}>;

export function useUpdateTeamMutation() {
  const { latestAccessToken } = useContext(AuthContext);
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
// region Create App and Subscription

type CreateAppAndSubscriptionParams = MutationWithArgs<{
  appName: string;
  appDescription: string;
  appTeamId: string;
  apiProductId: string;
}>;

export function useCreateAppAndSubscriptionMutation() {
  const { latestAccessToken } = useContext(AuthContext);
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
    await fetchJSON(`/apps/${appRes.id}/subscriptions`, {
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
// region Create Subscription

type CreateSubscriptionParams = MutationWithArgs<{
  apiProductId: string;
}>;

export function useCreateSubscriptionMutation(appId: string) {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const createApp = async (url: string, { arg }: CreateSubscriptionParams) => {
    if (!appId) {
      // eslint-disable-next-line no-console
      console.error("Tried to subscribe without an appId.");
      throw new Error();
    }
    await fetchJSON(url, {
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
// region (Admin) Approve/Reject Subscription

type UpdateSubscriptionParams = MutationWithArgs<{
  subscription: Subscription;
}>;

export function useAdminApproveSubscriptionMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const approveSub = async (_: string, { arg }: UpdateSubscriptionParams) => {
    const res = await fetchJSON(
      `/subscriptions/${arg.subscription.id}/approve`,
      {
        method: "POST",
        headers: getLatestAuthHeaders(latestAccessToken),
      }
    );
    mutate(`/apps/${arg.subscription.applicationId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
    return res;
  };
  return useSWRMutation(`approve-subscription`, approveSub);
}

export function useAdminRejectSubscriptionMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const rejectSub = async (_: string, { arg }: UpdateSubscriptionParams) => {
    await fetchJSON(`/subscriptions/${arg.subscription.id}/reject`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
    });
    mutate(`/apps/${arg.subscription.applicationId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(`reject-subscription`, rejectSub);
}

// -------------------------------- //
// region Delete Subscription

export function useDeleteSubscriptionMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const deleteSub = async (_: string, { arg }: UpdateSubscriptionParams) => {
    await fetchJSON(`/subscriptions/${arg.subscription.id}`, {
      method: "DELETE",
      headers: getLatestAuthHeaders(latestAccessToken),
    });
    mutate(`/apps/${arg.subscription.applicationId}/subscriptions`);
    mutate(`/subscriptions?status=${SubscriptionStatus.APPROVED}`);
    mutate(`/subscriptions?status=${SubscriptionStatus.PENDING}`);
    mutate(APP_SUBS_SWR_KEY);
  };
  return useSWRMutation(`delete-subscription`, deleteSub);
}

// -------------------------------- //
// region Delete Team

type DeleteTeamParams = MutationWithArgs<{ teamId: string }>;

export function useDeleteTeamMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const deleteTeam = async (_: string, { arg }: DeleteTeamParams) => {
    await fetchJSON(`/teams/${arg.teamId}`, {
      method: "DELETE",
      headers: getLatestAuthHeaders(latestAccessToken),
    });
    mutate(TEAMS_SWR_KEY);
  };
  return useSWRMutation(`delete-team`, deleteTeam);
}

// -------------------------------- //
// region Delete App

type DeleteAppParams = MutationWithArgs<{ appId: string }>;

export function useDeleteAppMutation() {
  const { latestAccessToken } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const deleteApp = async (_: string, { arg }: DeleteAppParams) => {
    await fetchJSON(`/apps/${arg.appId}`, {
      method: "DELETE",
      headers: getLatestAuthHeaders(latestAccessToken),
    });
    mutate(TEAMS_SWR_KEY);
  };
  return useSWRMutation(`delete-team`, deleteApp);
}

// -------------------------------- //
// region Create API Key

type CreateApiKeyParams = MutationWithArgs<{ apiKeyName: string }>;

export function useCreateApiKeyMutation(appId: string) {
  const { latestAccessToken } = useContext(AuthContext);
  const createApiKey = async (_: string, { arg }: CreateApiKeyParams) => {
    await fetchJSON(`/apps/${appId}/api-keys`, {
      method: "POST",
      headers: getLatestAuthHeaders(latestAccessToken),
      body: JSON.stringify(arg),
    });
  };
  return useSWRMutation(`/apps/${appId}/api-keys`, createApiKey);
}

// -------------------------------- //
// region Delete API Key

type DeleteApiKeyParams = MutationWithArgs<{ apiKeyId: string }>;

export function useDeleteApiKeyMutation(appId: string) {
  const { latestAccessToken } = useContext(AuthContext);
  const deleteApiKey = async (_: string, { arg }: DeleteApiKeyParams) => {
    await fetchJSON(`/api-keys/${arg.apiKeyId}`, {
      method: "DELETE",
      headers: getLatestAuthHeaders(latestAccessToken),
    });
  };
  return useSWRMutation(`/apps/${appId}/api-keys`, deleteApiKey);
}
