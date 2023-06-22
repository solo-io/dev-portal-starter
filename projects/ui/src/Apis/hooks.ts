import { useContext } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { PortalAuthContext } from "../Context/PortalAuthContext";
import {
  API,
  APIKey,
  APIProduct,
  APISchema,
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
        headers: {
          ...(args.length > 1 && args[1].headers ? args[1].headers : {}),
          ...authHeaders,
        },
      });
    },
    {
      ...(config ?? {}),
    }
  );
};

//
// Queries
//
export function useGetCurrentUser() {
  return useSwrWithAuth<User>("/me");
}

export function useListApis() {
  const res = useSwrWithAuth<API[] | APIProduct[]>("/apis");
  //
  // This is a preventative fix for the UI to not break while it
  // is being updated to use the new server-side APIProduct grouping.
  //
  let processedAPIs = res.data as API[];
  if (!!res.data?.length && "apiVersions" in res.data[0]) {
    //
    // If res.data is an APIProduct[], convert it to an API[].
    //
    let apiProducts = res.data as APIProduct[];
    processedAPIs = apiProducts.reduce((accum, curProd) => {
      accum.push(
        ...curProd.apiVersions.reduce((accum, api) => {
          accum.push({
            // TODO: Update apiId.
            apiId: curProd.apiProductId + api.apiVersion,
            apiProductDisplayName: curProd.apiProductDisplayName,
            apiProductId: curProd.apiProductId,
            apiVersion: api.apiVersion,
            contact: api.contact,
            customMetadata: api.customMetadata,
            description: api.description,
            license: api.license,
            termsOfService: api.termsOfService,
            title: api.title,
            usagePlans: api.usagePlans,
          });
          return accum;
        }, [] as API[])
      );
      return accum;
    }, [] as API[]);
  }
  return { ...res, data: processedAPIs };
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
