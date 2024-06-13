import { App, Team } from "../Apis/api-types";
import {
  API_DETAILS_URL_SEARCH_PARAM_TAB_KEY,
  apiProductDetailsTabValues,
} from "../Components/ApiDetails/gloo-gateway-components/ApiProductDetailsPageBody";

export function getApiProductDetailsDocsTabLink(apiProductId: string) {
  return `/apis/${apiProductId}?${API_DETAILS_URL_SEARCH_PARAM_TAB_KEY}=${apiProductDetailsTabValues.DOCS}`;
}

export function getApiProductDetailsSpecTabLink(apiProductId: string) {
  return `/apis/${apiProductId}?${API_DETAILS_URL_SEARCH_PARAM_TAB_KEY}=${apiProductDetailsTabValues.SPEC}`;
}

export function getAppDetailsLink(app: App) {
  return `/apps/${app.id}`;
}

export function getTeamDetailsLink(team: Team) {
  return `/teams/${team.id}`;
}
