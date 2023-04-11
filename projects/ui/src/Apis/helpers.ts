import useSWR, { Key } from "swr";

export const host = `${
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:8090"
}`;

const refreshTimes = {
  short: 5000,
  normal: 10000,
  long: 15000,
  veryLong: 30000,
  day: 24 * 60 * 60 * 1000,
};

// The idea behind this, which isn't needed yet, is to allow us to short-circuit this
//  for different settings. Example, some times we may need to cut down refresh times
//  or other times we may want to delay them indefinitely.
export function getNormalApiRefreshTime() {
  return refreshTimes.normal;
}
export function getLongApiRefreshTime() {
  return refreshTimes.long;
}
export function getVeryLongApiRefreshTime() {
  return refreshTimes.veryLong;
}
export function getDayApiRefreshTime() {
  return refreshTimes.day;
}
export function getPermissionsRefreshTime() {
  // Only refresh every 12 hours
  return 12 * 60 * 60 * 1000;
}

type useRequestOptions =
  | {
      key: Key;
      skip?: boolean;
    }
  | {
      methodDescriptorName: string;
      skip?: boolean;
    };

/**
 * Calls and returns `useSWR(...)` for the given function + arguments.
 * Generates a cached key by default from the function call.
 * @param fn The function to call.
 * @param fnArgs The function arguments for `fn`.
 * @param options
 * ```
 * {
 *  key?: 'custom-key' // Overrides the generated key.
 *  skip?: true // Sets key=null to skip the API request.
 * }
 * ```
 * @param swrConfig This is the same config that is passed into `useSWR`.
 * @returns `useSWR(...)`
 */
export function useRequest<T extends (...args: any) => Promise<any>>(
  fn: T,
  fnArgs: Parameters<T>,
  options: useRequestOptions,
  swrConfig?: Parameters<typeof useSWR>[2]
) {
  //
  // Set the key and return useSWR(...).
  let key: Key;
  if (options?.skip === true) key = null;
  else if ("key" in options) key = options.key;
  else {
    // Generates the key from the function + arguments.
    // Removes undefined/optional arguments from the end of the key.
    key = [options.methodDescriptorName, ...fnArgs] as any[];
    while (key.length > 1 && key[key.length - 1] === undefined) key.pop();
  }
  return useSWR<Awaited<ReturnType<T>>>(key, () => fn(...(fnArgs as any[])), {
    refreshInterval: getNormalApiRefreshTime(),
    ...(swrConfig as any),
  });
}
