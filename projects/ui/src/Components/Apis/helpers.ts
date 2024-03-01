import { APIVersion } from "../../Apis/api-types";

export function getApiDetailsLink<
  T extends { apiProductId: string; apiVersions: APIVersion[] }
>(api: T) {
  return `/api-details/${api.apiProductId}/${
    api.apiVersions.length > 0 ? api.apiVersions.at(0)?.apiVersion : ""
  }`;
}
