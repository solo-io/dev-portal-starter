import { useSwrWithAuthListApis } from "./list-apis-helpers";

//
// Queries
//

export function useListApis() {
  // Listing API's is more complicated since we support GMG and GG Portal Server APIs.
  // This uses a custom SWR fetcher function which may do several fetch calls.
  return useSwrWithAuthListApis();
}
