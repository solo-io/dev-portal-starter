import { APIVersion, App, Team } from "../Apis/api-types";

export function getApiDetailsLinkWithId(id: string) {
  return `/api-details/${id}`;
}

export function getApiDetailsLink<
  T extends { apiProductId: string; apiVersions: APIVersion[] }
>(api: T) {
  return `/api-details/${api.apiProductId}/${
    api.apiVersions.length > 0 ? api.apiVersions.at(0)?.apiVersion : ""
  }`;
}

export function getAppDetailsLink(app: App) {
  return `/apps/${app.id}`;
}

export function getTeamDetailsLink(team: Team) {
  return `/teams/${team.id}`;
}
