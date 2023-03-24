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
import { useQuery, useMutation } from "@tanstack/react-query";
import { API, APIKey, APISchema, UsagePlan, User } from "./api-types";

export const restpointPrefix = "http://localhost:31080/v1";

export async function fetchJson<T>(
  input: RequestInfo | URL,
  fetchOptions?: { method?: string; body?: string }
): Promise<T> {
  const response = await fetch(input, {
    crossDomain: true,
    ...fetchOptions,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function useSoloQuery<T>(apiCallString: string, swallowError?: boolean) {
  return useQuery({
    // Key used for caching queries
    queryKey: [apiCallString],
    queryFn: () => fetchJson<T>(restpointPrefix + apiCallString),
    //Whether the API failures should auto-catch to an error boundary
    useErrorBoundary: !swallowError,
    // Number of attempt retries
    retry: 5,
  });
}

export function useGetCurrentUser(swallowError?: boolean) {
  return useSoloQuery<User>("/me", swallowError);
}

export function useListApis(swallowError?: boolean) {
  return useSoloQuery<API[]>("/apis", swallowError);
}
export function useGetApiDetails(id: string, swallowError?: boolean) {
  return useSoloQuery<APISchema>(`/apis/${id}/schema`, swallowError);
}

export function useListUsagePlans(swallowError?: boolean) {
  return useSoloQuery<UsagePlan[]>(`/usage-plans`, swallowError);
}

export function useListApiKeys(
  apis?: string[],
  usagePlans?: string[],
  swallowError?: boolean
) {
  const apiOptionsExist = !!apis?.length;
  const plansOptionsExist = !!usagePlans?.length;
  const optionsString =
    apiOptionsExist || plansOptionsExist
      ? `?${apiOptionsExist ? `apis=${apis.join(",")}` : ""}${
          apiOptionsExist && plansOptionsExist ? "&" : ""
        }${plansOptionsExist ? `usagePlans=${usagePlans.join(",")}` : ""}`
      : "";

  return useSoloQuery<{ usagePlan: string; apiKeys: APIKey[] }[]>(
    `/api-keys${optionsString}`,
    swallowError
  );
}

export function useCreateApiKey(
  apiId: string,
  usagePlan: string,
  swallowError?: boolean
) {
  // Any calls to this may want to make use of the following in the `onSettled` case
  //  queryClient.invalidateQueries("api-keys");
  // If so, useQueryClient will need to be imported from the @tanstack/react-query set

  return useMutation({
    mutationFn: () =>
      fetchJson<APIKey>("api-keys", {
        method: "POST",
        body: JSON.stringify({ usagePlan, apiId }),
      }),
    useErrorBoundary: !swallowError,
  });
}

export function useDeleteApiKey(apiId: string, swallowError?: boolean) {
  // Any calls to this may want to make use of the following in the `onSettled` case
  //  queryClient.invalidateQueries(`api-keys/${apiId}`);
  // If so, useQueryClient will need to be imported from the @tanstack/react-query set

  return useMutation({
    mutationFn: () =>
      fetchJson<{ usagePlan: string; apiKeys: APIKey[] }[]>(
        `api-keys/${apiId}`,
        {
          method: "DELETE",
        }
      ),
    useErrorBoundary: !swallowError,
  });
}
