import { useContext } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "../Context/AuthContext";
import { APIKey, ApiVersionSchema, UsagePlan } from "./api-types";
import { fetchJSON, portalServerUrl, useSwrWithAuth } from "./utility";

//
// Queries
//

export function useGetApiDetails(id?: string) {
  return useSwrWithAuth<ApiVersionSchema>(`/apis/${id}/schema`);
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
  const { latestAccessToken } = useContext(AuthContext);
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
  const { latestAccessToken } = useContext(AuthContext);
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
