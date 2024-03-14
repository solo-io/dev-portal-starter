import { App, Team } from "../Apis/api-types";

export function getApiProductDetailsLink(apiProductId: string) {
  return `/apis/${apiProductId}`;
}

export function getAppDetailsLink(app: App) {
  return `/apps/${app.id}`;
}

export function getTeamDetailsLink(team: Team) {
  return `/teams/${team.id}`;
}
