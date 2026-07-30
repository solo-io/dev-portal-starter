import { beforeEach, describe, expect, it } from "vitest";
import {
  capturePostLoginLocation,
  consumePostLoginLocation,
  isAuthCodeCallbackUrl,
} from "./postLoginRedirect";

// The sessionStorage key the module stores the location under. Seeded directly
// in the validation tests to simulate a tampered value.
const STORAGE_KEY = "gloo-platform-portal-post-login-redirect";

function setLocation(path: string) {
  window.history.replaceState({}, "", path);
}

beforeEach(() => {
  sessionStorage.clear();
  setLocation("/");
});

describe("capture and consume", () => {
  it("round-trips the current path, search, and hash, consuming it once", () => {
    setLocation("/apis?filter=petstore#operations");
    capturePostLoginLocation();
    expect(consumePostLoginLocation()).toBe("/apis?filter=petstore#operations");
    // Consuming clears the stored value.
    expect(consumePostLoginLocation()).toBeNull();
  });

  it("skips the home page and clears any previously captured location", () => {
    setLocation("/apis");
    capturePostLoginLocation();
    setLocation("/");
    capturePostLoginLocation();
    expect(consumePostLoginLocation()).toBeNull();
  });

  it("skips an in-flight auth-code callback URL", () => {
    setLocation("/apis?code=abc123&state=xyz");
    capturePostLoginLocation();
    expect(consumePostLoginLocation()).toBeNull();
  });

  it("returns null when nothing was captured", () => {
    expect(consumePostLoginLocation()).toBeNull();
  });
});

describe("restore-target validation (open-redirect guard)", () => {
  it.each([
    "//evil.example.com/phish",
    "https://evil.example.com/",
    "/\\evil.example.com",
    "\\\\evil.example.com",
    "no-leading-slash",
    "",
  ])("rejects %j", (target) => {
    sessionStorage.setItem(STORAGE_KEY, target);
    expect(consumePostLoginLocation()).toBeNull();
  });

  it("accepts a normal in-app path", () => {
    sessionStorage.setItem(STORAGE_KEY, "/teams/team-1?tab=apps#top");
    expect(consumePostLoginLocation()).toBe("/teams/team-1?tab=apps#top");
  });
});

describe("isAuthCodeCallbackUrl", () => {
  it("is true only when the URL carries an auth ?code=", () => {
    setLocation("/apis?code=abc123&state=xyz");
    expect(isAuthCodeCallbackUrl()).toBe(true);
    setLocation("/apis?other=1");
    expect(isAuthCodeCallbackUrl()).toBe(false);
    setLocation("/");
    expect(isAuthCodeCallbackUrl()).toBe(false);
  });
});
