import { useContext } from "react";
import useSWR from "swr";
import { AppContext } from "../Context/AppContext";
import { AuthContext } from "../Context/AuthContext";
import { customLog } from "../Utility/utility";
import {
  API,
  APIProduct,
  ApiProductSummary,
  ApiVersion,
  ApiVersionExtended,
} from "./api-types";
import { fetchJSON, portalServerUrl } from "./utility";

type ApisEndpointResponseType =
  | API[]
  | APIProduct[]
  | ApiProductSummary[]
  | null;

/**
 * Performs custom fetching logic needed for the listApis call to
 * support "gloo-gateway" and "gloo-mesh-gateway".
 */
export const useSwrWithAuthListApis = () => {
  const { latestAccessToken } = useContext(AuthContext);
  const { updatePortalServerType, portalServerType } = useContext(AppContext);

  const fetchInit = {} as RequestInit;
  if (!!latestAccessToken) {
    fetchInit.headers = {
      Authorization: `Bearer ${latestAccessToken}`,
    };
  }

  return useSWR<(API | ApiVersionExtended)[]>("list-apis", async () => {
    const gg_apisEndpoint = portalServerUrl + "/api-products";
    const gmg_apisEndpoint = portalServerUrl + "/apis";

    // For portalServerType:
    // - "unknown, and "gloo-mesh-gateway": use GMG endpoint
    // - "gloo-gateway": use GG endpoint
    let apisEndpoint =
      portalServerType === "gloo-gateway" ? gg_apisEndpoint : gmg_apisEndpoint;

    customLog(
      `Fetching APIs from ${apisEndpoint} (identified as ${portalServerType}).`
    );
    let res: ApisEndpointResponseType = null;
    try {
      res = await fetchJSON(apisEndpoint, fetchInit);
    } catch {}
    if (
      // If we didn't just try the GG endpoint, and
      apisEndpoint !== gg_apisEndpoint &&
      // the GG+GMG endpoints aren't the same, and
      gg_apisEndpoint !== gmg_apisEndpoint &&
      // the GMG request failed, or
      (!res ||
        // the GMG request didn't fail, it returned data, but it's not an array, or
        !Array.isArray(res) ||
        // the GMG request didn't fail, it returned data, but
        (!!res.length &&
          // it didn't return either GG or GMG data,
          !("id" in res[0]) &&
          !("apiVersions" in res[0])))
    ) {
      // try with the GG endpoint.
      apisEndpoint = gg_apisEndpoint;
      try {
        res = await fetchJSON(apisEndpoint, fetchInit);
      } catch {}
    }

    let processedAPIs: (API | ApiVersionExtended)[] = [];
    if (!!res?.length) {
      //
      // Check the portal server API type
      //
      let identifiedPortalServerType: typeof portalServerType = "unknown";
      if ("id" in res[0]) {
        identifiedPortalServerType = "gloo-gateway";
      } else {
        identifiedPortalServerType = "gloo-mesh-gateway";
      }
      updatePortalServerType(identifiedPortalServerType);

      //
      // Transform the data
      //
      // For "gloo-mesh-gateway"
      if (identifiedPortalServerType === "gloo-mesh-gateway") {
        if ("apiVersions" in res[0]) {
          // Newer versions return the data grouped by APIProduct,
          // so we convert it back to a list here.
          const apiProducts = res as APIProduct[];
          processedAPIs = apiProducts.reduce((accum, curProd) => {
            accum.push(
              ...curProd.apiVersions.reduce((accumVer, api) => {
                accumVer.push({
                  apiId: api.apiId,
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
                return accumVer;
              }, [] as API[])
            );
            return accum;
          }, [] as API[]);
        } else {
          processedAPIs = res as API[];
        }
      }
      // For "gloo-gateway"
      if (identifiedPortalServerType === "gloo-gateway") {
        // Fetch the information for each product.
        const summaries = res as ApiProductSummary[];
        // We have to do a separate request for each ApiProduct in order to get their versions.
        for (let i = 0; i < summaries.length; i++) {
          const apiProductSummary = summaries[i];
          const getVersionsUrl = `${apisEndpoint}/${apiProductSummary.id}/versions`;
          customLog(
            `Fetching API versions from ${getVersionsUrl} (identified as ${identifiedPortalServerType}).`
          );
          let versions: ApiVersion[] = [];
          try {
            versions = await (await fetch(getVersionsUrl, fetchInit)).json();
          } catch {}
          customLog(
            `Fetched ${getVersionsUrl} (identified as ${identifiedPortalServerType}) and recieved the response: ${JSON.stringify(
              versions
            )}`
          );
          if (!!versions?.length) {
            // Add each API product's version to the processedAPIs.
            processedAPIs.push(
              ...versions.map((v) => {
                const apiVersionExtended: ApiVersionExtended = {
                  ...v,
                  apiProductDescription: apiProductSummary.description,
                  apiProductName: apiProductSummary.name,
                };
                return apiVersionExtended;
              })
            );
          }
        }
      }
    }

    return processedAPIs;
  });
};
