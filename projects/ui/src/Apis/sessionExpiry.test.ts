import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The module keeps its state at module scope (the debounce timestamp, the
// pending-reason latch, the listener set, the anonymous-fallback flag), so
// each test imports a fresh copy.
async function freshSessionExpiry() {
  vi.resetModules();
  return await import("./sessionExpiry");
}

describe("sessionExpiry", () => {
  beforeEach(() => {
    // The notify debounce compares Date.now() timestamps.
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("delivers the reason to subscribers", async () => {
    const { notifySessionExpired, subscribeSessionExpired } =
      await freshSessionExpiry();
    const seen: string[] = [];
    subscribeSessionExpired((reason) => seen.push(reason));
    notifySessionExpired("redirect");
    expect(seen).toEqual(["redirect"]);
  });

  it("debounces a burst of notifications into a single delivery", async () => {
    const { notifySessionExpired, subscribeSessionExpired } =
      await freshSessionExpiry();
    const seen: string[] = [];
    subscribeSessionExpired((reason) => seen.push(reason));
    // A burst, as when several in-flight requests all fail at once.
    notifySessionExpired("unauthorized");
    notifySessionExpired("unauthorized");
    notifySessionExpired("redirect");
    expect(seen).toEqual(["unauthorized"]);
    // Once the debounce window has passed, notifications are delivered again.
    vi.advanceTimersByTime(600);
    notifySessionExpired("redirect");
    expect(seen).toEqual(["unauthorized", "redirect"]);
  });

  it("latches a notification fired before any subscriber and delivers it to the first subscriber only", async () => {
    const { notifySessionExpired, subscribeSessionExpired } =
      await freshSessionExpiry();
    // e.g. the first request resolves before the handler's effect has run.
    notifySessionExpired("redirect");
    const first: string[] = [];
    subscribeSessionExpired((reason) => first.push(reason));
    expect(first).toEqual(["redirect"]);
    // The latch is consumed; later subscribers don't see a stale event.
    const second: string[] = [];
    subscribeSessionExpired((reason) => second.push(reason));
    expect(second).toEqual([]);
  });

  it("stops delivering after unsubscribe", async () => {
    const { notifySessionExpired, subscribeSessionExpired } =
      await freshSessionExpiry();
    const seen: string[] = [];
    const unsubscribe = subscribeSessionExpired((reason) => seen.push(reason));
    notifySessionExpired("redirect");
    unsubscribe();
    vi.advanceTimersByTime(600);
    notifySessionExpired("redirect");
    expect(seen).toEqual(["redirect"]);
  });

  it("keeps the anonymous-fallback flag off until enabled", async () => {
    const { enableAnonymousFallback, isAnonymousFallbackEnabled } =
      await freshSessionExpiry();
    expect(isAnonymousFallbackEnabled()).toBe(false);
    enableAnonymousFallback();
    expect(isAnonymousFallbackEnabled()).toBe(true);
  });
});
