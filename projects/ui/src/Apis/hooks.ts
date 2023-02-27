/*  API HOOKS
*   This file has how we access data in a hooks-style fashion.
*
*   For all hooks we provide back:
*     isLoading: boolean
*     error: null | <ErrorInfo>  NOTE:: Update with actual ErrorInfo type before public release
*     data: any
*     refetch: <refetches data, errors will be thrown if applicable>

*   For more information, get started with: 
*      https://tanstack.com/query/v4/docs/react/reference/useQuery
*/
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API, APIKey, UsagePlan, User } from "./api-types";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function soloUseQuery<T>(apiCallString: string) {
  return useQuery({
    queryKey: [apiCallString],
    queryFn: () => fetchJson<T>(/*SOME REST ENDPOINT + */ apiCallString),
  });
}

export function useGetCurrentUser() {
  return soloUseQuery<User>("/me");
}

export function useListApis() {
  return soloUseQuery<API[]>("/apis");
}
export function useGetApiDetails(id: string) {
  return soloUseQuery<string>(`/apis/${id}/schema`);
}

export function useListUsagePlans(id: string) {
  return soloUseQuery<UsagePlan[]>(`/usage-plans`);
}

export function useListApiKeys(apis?: string[], usagePlans?: string[]) {
  const apiOptionsExist = !!apis?.length;
  const plansOptionsExist = !!usagePlans?.length;
  const optionsString =
    apiOptionsExist || plansOptionsExist
      ? `?${apiOptionsExist ? `apis=${apis.join(",")}` : ""}${
          apiOptionsExist && plansOptionsExist ? "&" : ""
        }${plansOptionsExist ? `usagePlans=${usagePlans.join(",")}` : ""}`
      : "";

  return soloUseQuery<{ usagePlan: string; apiKeys: APIKey[] }[]>(
    `/api-keys${optionsString}`
  );
}

export function useCreateApiKey(apiId: strng, usagePlan: string) {
  // Any calls to this may want to make use of the following in the `onSettled` case
  //  queryClient.invalidateQueries("api-keys");

  return useMutation({
    mutationFn: () =>
      fetchJson<APIKey>("api-keys", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usagePlan, apiId }),
      }),
  });
}

export function useCreateApiKey(apiId: strng) {
  // Any calls to this may want to make use of the following in the `onSettled` case
  //  queryClient.invalidateQueries("api-keys");

  return useMutation({
    mutationFn: () =>
      fetchJson<{ usagePlan: string; apiKeys: APIKey[] }[]>(
        `api-keys/${apiId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      ),
  });
}
