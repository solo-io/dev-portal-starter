import { APIProduct } from "../../Apis/api-types";

export const getApiDetailsLink = (api: APIProduct) => {
  return `/api-details/${api.apiProductId}/${
    api.apiVersions.length > 0 ? api.apiVersions.at(0)?.apiVersion : ""
  }`;
};
