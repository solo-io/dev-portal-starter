import { SWRResponse } from "swr";

export const createEmptyFn = () =>
  // eslint-disable-next-line
  ((...args: any) => {}) as (...args: any) => any;

export function createLoadedSwrResponse<T>(data: T): SWRResponse<T> {
  return {
    data,
    error: undefined,
    isValidating: false,
    mutate: createEmptyFn(),
    isLoading: false,
  };
}
