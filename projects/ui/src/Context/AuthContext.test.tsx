import { act, cleanup, render, waitFor } from "@testing-library/react";
import { ContextType, useContext } from "react";
import { MemoryRouter } from "react-router";
import { SWRConfig, mutate } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGetCurrentUser } from "../Apis/gg_hooks";
import { doAccessTokenRequest } from "../Utility/accessTokenRequest";
import {
  AuthContext,
  AuthContextProvider,
  LOCAL_STORAGE_TOKENS_KEY,
} from "./AuthContext";

// Hoisted above the imports by vitest. Stubbed so the refresh-token request
// resolves to tokens this test chooses, without a token endpoint.
vi.mock("../Utility/accessTokenRequest", () => ({
  doAccessTokenRequest: vi.fn(),
}));

// These tests exist for one property: when the access token is replaced, the
// queries that get re-run must send the NEW token. `useSwrWithAuth` reads
// `latestAccessToken` during render and bakes it into the fetcher closure, and
// SWR keeps the fetcher from the most recent render — so revalidating before
// React has re-rendered re-sends the token being replaced. That is why the
// assertions below are about Authorization headers on the wire rather than
// about which `mutate` overload was called.

/** A JWT `parseJwt` can read: only the payload segment has to be real. */
function makeAccessToken(label: string, expiresInSeconds = 3600) {
  const payload = {
    label,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  return `header.${window.btoa(JSON.stringify(payload))}.signature`;
}

function makeTokensResponse(label: string, expiresInSeconds = 3600) {
  return {
    access_token: makeAccessToken(label, expiresInSeconds),
    refresh_token: `${label}-refresh`,
    id_token: makeAccessToken(`${label}-id`, expiresInSeconds),
    token_type: "Bearer",
    expires_in: expiresInSeconds,
  } as any;
}

/** The Authorization header of every `/me` request, in order. */
let requestedAuthHeaders: (string | null)[] = [];
/** The `data` this render of the probe saw, in order. */
let observedUserData: (unknown | undefined)[] = [];

const auth: { current?: ContextType<typeof AuthContext> } = {};

/**
 * Stands in for an authed page: it holds a real SWR query whose fetcher picks
 * up the token from context, and exposes the auth context to the test.
 */
function Probe() {
  auth.current = useContext(AuthContext);
  const { data } = useGetCurrentUser();
  observedUserData.push(data);
  return null;
}

function renderApp() {
  return render(
    // No `provider` override: the app's revalidation goes through SWR's
    // top-level `mutate`, which is bound to the default cache.
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MemoryRouter>
        <AuthContextProvider>
          <Probe />
        </AuthContextProvider>
      </MemoryRouter>
    </SWRConfig>,
  );
}

const lastAuthHeader = () =>
  requestedAuthHeaders[requestedAuthHeaders.length - 1];

describe("AuthContext token revalidation", () => {
  beforeEach(() => {
    requestedAuthHeaders = [];
    observedUserData = [];
    auth.current = undefined;
    localStorage.clear();
    vi.mocked(doAccessTokenRequest).mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        requestedAuthHeaders.push(headers.get("Authorization"));
        return new Response(JSON.stringify({ email: "user@example.com" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }),
    );
  });

  afterEach(async () => {
    cleanup();
    vi.unstubAllGlobals();
    // The default SWR cache is module state shared by every test in this file.
    await mutate(() => true, undefined, { revalidate: false });
  });

  it("sends the refreshed token on the queries it re-runs after a silent refresh", async () => {
    const oldTokens = makeTokensResponse("old");
    const newTokens = makeTokensResponse("new");
    localStorage.setItem(LOCAL_STORAGE_TOKENS_KEY, JSON.stringify(oldTokens));
    vi.mocked(doAccessTokenRequest).mockResolvedValue(newTokens);

    renderApp();
    await waitFor(() => expect(requestedAuthHeaders).toHaveLength(1));
    expect(lastAuthHeader()).toBe(`Bearer ${oldTokens.access_token}`);
    await waitFor(() =>
      expect(observedUserData.at(-1)).toEqual({ email: "user@example.com" }),
    );
    const dataLoadedAtIndex = observedUserData.length;

    // A request came back unauthorized and the access token had simply lapsed
    // (see SessionExpiryHandler); the refresh token is still good.
    await act(async () => {
      await expect(auth.current!.tryRefreshTokens()).resolves.toBe(true);
    });

    // The retried query must carry the token that replaced the lapsed one —
    // re-running it with the old token would just get rejected again.
    await waitFor(() => expect(requestedAuthHeaders).toHaveLength(2));
    expect(lastAuthHeader()).toBe(`Bearer ${newTokens.access_token}`);

    // A refresh is the same user with a fresher token, so the cached data stays
    // on screen while the queries revalidate underneath it.
    expect(observedUserData.slice(dataLoadedAtIndex)).not.toContain(undefined);
  });

  it("drops the previous session's data when another tab changes the session", async () => {
    const ownTokens = makeTokensResponse("own");
    const otherTabTokens = makeTokensResponse("other-tab");
    localStorage.setItem(LOCAL_STORAGE_TOKENS_KEY, JSON.stringify(ownTokens));

    renderApp();
    await waitFor(() => expect(requestedAuthHeaders).toHaveLength(1));
    expect(lastAuthHeader()).toBe(`Bearer ${ownTokens.access_token}`);
    await waitFor(() =>
      expect(observedUserData.at(-1)).toEqual({ email: "user@example.com" }),
    );
    const dataLoadedAtIndex = observedUserData.length;

    // Another tab logged in as someone else; this tab notices on focus.
    localStorage.setItem(
      LOCAL_STORAGE_TOKENS_KEY,
      JSON.stringify(otherTabTokens),
    );
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });

    await waitFor(() => expect(requestedAuthHeaders).toHaveLength(2));
    expect(lastAuthHeader()).toBe(`Bearer ${otherTabTokens.access_token}`);

    // Unlike a refresh, this may be a different user, so the data fetched for
    // the previous session is discarded rather than shown while revalidating.
    expect(observedUserData.slice(dataLoadedAtIndex)).toContain(undefined);
  });
});
