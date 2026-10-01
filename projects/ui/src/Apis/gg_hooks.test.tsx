import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useListClientCredentialsForApp } from "./gg_hooks";

function stubFetchStatus(status: number) {
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      type: "default",
      status,
      ok: false,
      headers: { get: () => "application/json" },
      json: async () => ({ message: `status ${status}` }),
    } as unknown as Response)
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

// A fresh cache per test, and a retry interval short enough that a retry, if
// there is going to be one, happens within the test.
const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      dedupingInterval: 0,
      errorRetryInterval: 10,
    }}
  >
    {children}
  </SWRConfig>
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useListClientCredentialsForApp", () => {
  it("does not retry a 404", async () => {
    const fetchMock = stubFetchStatus(404);
    const { result } = renderHook(
      () => useListClientCredentialsForApp("app-1"),
      { wrapper }
    );

    await waitFor(() => expect(result.current.error).toBeDefined());
    // Many retry intervals' worth of time.
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  // Shows that the wait above is long enough to catch a retry.
  it("retries any other failure", async () => {
    const fetchMock = stubFetchStatus(503);
    renderHook(() => useListClientCredentialsForApp("app-1"), { wrapper });

    await waitFor(() =>
      expect(fetchMock.mock.calls.length).toBeGreaterThan(1)
    );
  });
});
