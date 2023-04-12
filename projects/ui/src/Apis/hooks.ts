import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { API, APIKey, APISchema, UsagePlan, User } from "./api-types";

export const restpointPrefix =
  // import.meta.env.VITE_RESTPOINT ?? "/portal-server/v1";
  "/portal-server/v1";

async function fetchJSON(...args: Parameters<typeof fetch>) {
  if (typeof args[0] !== "string") return;
  let url = restpointPrefix + args[0];
  const newArgs: typeof args = [
    url,
    {
      ...args[1],
      headers: {
        ...args[1]?.headers,
        "Content-Type": "application/json",
      },
    },
  ];
  return fetch(...newArgs).then((res) => res.json());
}

//
// Queries
//

export function useGetCurrentUser() {
  return useSWR<User>("/me", fetchJSON);
}

export function useListApis() {
  return useSWR<API[]>("/apis", fetchJSON);
}
export function useGetApiDetails(id?: string) {
  return useSWR<APISchema>(`/apis/${id}/schema`, fetchJSON);
}

export function useListUsagePlans() {
  return useSWR<UsagePlan[]>(`/usage-plans`, fetchJSON);
}

export function useListApiKeys(usagePlan: string) {
  // const optionsString = !!usagePlans?.length
  //   ? `?usagePlans=${usagePlans.join(",")}`
  //   : "";

  // TODO: Add support for getting keys for multiple usage plans.
  // TODO: While also having the cache invalidation work (see useAddKeyMutation).
  return useSWR<{ usagePlan: string; apiKeys: APIKey[] }[]>(
    `/api-keys?usagePlans=${usagePlan}`,
    fetchJSON
  );
}

//
// Mutations
//

export function useCreateKeyMutation() {
  const { mutate } = useSWRConfig();

  const createKey = async (
    url: string,
    {
      arg: { usagePlanName, apiKeyName },
    }: { arg: { usagePlanName: string; apiKeyName: string } }
  ) => {
    const res = await fetchJSON(url, {
      method: "POST",
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
  const { mutate } = useSWRConfig();

  const deleteKey = async (
    url: string,
    {
      arg: { apiKeyId, usagePlanName },
    }: { arg: { apiKeyId: string; usagePlanName: string } }
  ) => {
    await fetch(`${restpointPrefix}${url}/${apiKeyId}`, {
      method: "DELETE",
    });
    // TODO: Mutation should invalidate all usage plans that this api key is in.
    mutate(`/api-keys?usagePlans=${usagePlanName}`);
  };

  return useSWRMutation(`/api-keys`, deleteKey);
}
