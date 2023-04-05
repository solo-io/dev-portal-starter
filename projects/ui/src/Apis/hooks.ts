/*  API HOOKS
*   This file has how we access data in a hooks-style fashion.
*
*   For all hooks it is easy to access from the components calling them:
*     isLoading: boolean
*     error: null | <ErrorInfo>  NOTE:: Update with actual ErrorInfo type before public release
*     data: any
*     refetch: <refetches data, errors will be thrown if applicable>

*   For more information, get started with: 
*      https://tanstack.com/query/v4/docs/react/reference/useQuery
*/
import { useQuery } from "@tanstack/react-query";
import { API, APIKey, APISchema, UsagePlan, User } from "./api-types";

export const restpointPrefix =
  process.env.RESTPOINT ?? "http://localhost:31080/v1";

export async function fetchJson<T>(
  input: RequestInfo | URL,
  fetchOptions?: { method?: string; body?: string; header?: string }
): Promise<T> {
  const response = await fetch(input, {
    ...fetchOptions,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function useSoloQuery<T>(
  apiCallString: string,
  fetchOptions?: { method?: string; body?: string; header?: string },
  swallowError?: (err: unknown) => boolean
) {
  return useQuery({
    // Key used for caching queries
    queryKey: [apiCallString],
    queryFn: () => fetchJson<T>(restpointPrefix + apiCallString),
    //Whether the API failures should auto-catch to an error boundary
    useErrorBoundary: !swallowError || swallowError,
    // Number of attempt retries
    retry: 5,
  });
}

export function useGetCurrentUser() {
  return useSoloQuery<User>("/me", (err: any) => err.response?.status === 401);
}

export function useListApis() {
  return useSoloQuery<API[]>("/apis");
}
export function useGetApiDetails(id?: string) {
  return useSoloQuery<APISchema>(`/apis/${id}/schema`);
}

export function useListUsagePlans() {
  return useSoloQuery<UsagePlan[]>(`/usage-plans`);
}

export function useListApiKeys(usagePlans?: string[]) {
  const optionsString = !!usagePlans?.length
    ? `?usagePlans=${usagePlans.join(",")}`
    : "";

  return useSoloQuery<{ usagePlan: string; apiKeys: APIKey[] }[]>(
    `/api-keys${optionsString}`
  );
}
