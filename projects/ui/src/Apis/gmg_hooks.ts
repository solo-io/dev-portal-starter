import { useContext, useMemo } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AuthContext } from "../Context/AuthContext";
import {
  APIKey,
  ApiVersionSchema,
  UsagePlan,
  normalizeApiVersionSchema,
} from "./api-types";
import { fetchJSON, portalServerURL, useSwrWithAuth } from "./utility";

//
// Queries
//

export function useGetApiDetails(id?: string) {
  // Portal v1 sends the OpenAPI document as a JSON string and newer servers
  // send an object, so normalize here rather than in each consumer. Memoized so
  // a re-render (the Redoc/Swagger toggle) doesn't re-parse the whole document.
  const res = useSwrWithAuth<string | ApiVersionSchema>(`/apis/${id}/schema`);
  const data = useMemo(() => normalizeApiVersionSchema(res.data), [res.data]);
  return { ...res, data };
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
      await fetch(`${portalServerURL}${url}/${apiKeyId}`, {
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
