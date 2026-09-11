import { beforeEach, describe, expect, it } from "vitest";
import { getPkceRedirectUri } from "./loginRedirect";

function setLocation(path: string) {
  window.history.replaceState({}, "", path);
}

beforeEach(() => {
  setLocation("/");
});

describe("getPkceRedirectUri", () => {
  it.each([
    "/",
    "/apis",
    "/apis/tracks-api/v1",
    "/teams/team-1?tab=apps#top",
  ])(
    "is the same fixed callback URL wherever login starts from (%s)",
    (path) => {
      setLocation(path);
      expect(getPkceRedirectUri()).toBe(`${window.location.origin}/callback`);
    },
  );
});
