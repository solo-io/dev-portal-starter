import { afterEach, describe, expect, it, vi } from "vitest";

// `fetchJSON` and the session-expiry signal share module-level state (the
// notify debounce, the anonymous-fallback flag), so each test loads fresh
// copies of both from the same module graph.
async function freshModules() {
  vi.resetModules();
  const sessionExpiry = await import("./sessionExpiry");
  const utility = await import("./utility");
  return { sessionExpiry, utility };
}

// A minimal stand-in for the `Response` shapes `fetchJSON` inspects: `type`
// (for opaque redirects), `status`/`ok`, the content-type header, and `json()`.
function fakeResponse(
  overrides: {
    type?: ResponseType;
    status?: number;
    ok?: boolean;
    contentType?: string;
    body?: unknown;
  } = {}
) {
  const {
    type = "default",
    status = 200,
    ok = status >= 200 && status < 300,
    contentType = "application/json",
    body = {},
  } = overrides;
  return {
    type,
    status,
    ok,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type" ? contentType : null,
    },
    json: async () => body,
  } as unknown as Response;
}

function stubFetch(response: Response) {
  const fetchMock = vi.fn((..._args: Parameters<typeof fetch>) =>
    Promise.resolve(response)
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchJSON session-expiry detection", () => {
  it('treats an opaque redirect as expiry with reason "redirect"', async () => {
    const { sessionExpiry, utility } = await freshModules();
    // What a gateway 302 -> login page looks like under `redirect: "manual"`.
    stubFetch(fakeResponse({ type: "opaqueredirect", status: 0, ok: false }));
    const reasons: string[] = [];
    sessionExpiry.subscribeSessionExpired((reason) => reasons.push(reason));
    await expect(utility.fetchJSON("http://api.test/me")).rejects.toBeInstanceOf(
      sessionExpiry.SessionExpiredError
    );
    expect(reasons).toEqual(["redirect"]);
  });

  it('treats a 401 as expiry with reason "unauthorized"', async () => {
    const { sessionExpiry, utility } = await freshModules();
    stubFetch(
      fakeResponse({ status: 401, body: { message: "authentication required" } })
    );
    const reasons: string[] = [];
    sessionExpiry.subscribeSessionExpired((reason) => reasons.push(reason));
    await expect(utility.fetchJSON("http://api.test/me")).rejects.toBeInstanceOf(
      sessionExpiry.SessionExpiredError
    );
    expect(reasons).toEqual(["unauthorized"]);
  });

  it('treats an HTML body where JSON was expected as expiry with reason "redirect"', async () => {
    const { sessionExpiry, utility } = await freshModules();
    // A login page served in place of the API response (a same-origin auth
    // layer swapping in a login page without a redirect).
    stubFetch(fakeResponse({ contentType: "text/html; charset=utf-8" }));
    const reasons: string[] = [];
    sessionExpiry.subscribeSessionExpired((reason) => reasons.push(reason));
    await expect(
      utility.fetchJSON("http://api.test/apis")
    ).rejects.toBeInstanceOf(sessionExpiry.SessionExpiredError);
    expect(reasons).toEqual(["redirect"]);
  });

  it("returns parsed JSON on success without signalling expiry", async () => {
    const { sessionExpiry, utility } = await freshModules();
    stubFetch(fakeResponse({ body: { apis: [{ id: "petstore" }] } }));
    const reasons: string[] = [];
    sessionExpiry.subscribeSessionExpired((reason) => reasons.push(reason));
    await expect(utility.fetchJSON("http://api.test/apis")).resolves.toEqual({
      apis: [{ id: "petstore" }],
    });
    expect(reasons).toEqual([]);
  });

  it("surfaces a server error as a plain error, not as expiry", async () => {
    const { sessionExpiry, utility } = await freshModules();
    stubFetch(fakeResponse({ status: 500, body: { message: "boom" } }));
    const reasons: string[] = [];
    sessionExpiry.subscribeSessionExpired((reason) => reasons.push(reason));
    const error = await utility
      .fetchJSON("http://api.test/apis")
      .catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(sessionExpiry.SessionExpiredError);
    expect(error.message).toBe("boom");
    expect(reasons).toEqual([]);
  });
});

describe("request shaping", () => {
  it("always sends requests in manual-redirect mode", async () => {
    const { utility } = await freshModules();
    const fetchMock = stubFetch(fakeResponse());
    await utility.fetchJSON("http://api.test/apis");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/apis",
      expect.objectContaining({ redirect: "manual" })
    );
  });

  it("omits credentials only once the anonymous fallback engages", async () => {
    const { sessionExpiry, utility } = await freshModules();
    const fetchMock = stubFetch(fakeResponse());
    await utility.fetchJSON("http://api.test/apis");
    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty("credentials");
    sessionExpiry.enableAnonymousFallback();
    await utility.fetchJSON("http://api.test/apis");
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ credentials: "omit" });
  });
});
