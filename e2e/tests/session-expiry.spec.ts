import { test, expect, APIRequestContext } from '@playwright/test';

// Exercises the UI's session-expiry handling against the mock portal API's
// test-only auth-mode toggle (see mock-portal-api/index.js). The e2e image is
// built without an OIDC config and without VITE_SESSION_EXPIRED_BEHAVIOR, so
// the deployment behaves as the default: fall back to anonymous browsing.
//
// A gateway with a dead session answers API requests with either a 302 to a
// login page (BFF ext-auth) or a 401. The UI treats those differently:
//   - a redirect is unambiguous and always handled (toast + anonymous fallback)
//   - a 401 only counts as expiry while a session is established; an anonymous
//     visitor legitimately gets 401s from auth-required endpoints.

const MOCK_API_URL = `http://localhost:${process.env.E2E_MOCK_API_PORT || '31080'}`;
const SESSION_EXPIRED_TOAST = 'Your session has expired.';

async function setAuthMode(
  request: APIRequestContext,
  mode: 'ok' | 'expired-401' | 'expired-302',
) {
  const res = await request.post(`${MOCK_API_URL}/__test/auth-mode`, {
    data: { mode },
  });
  expect(res.ok()).toBeTruthy();
}

// The auth mode is global state in the mock server; always restore it so a
// failure here can't poison other specs.
test.afterEach(async ({ request }) => {
  await setAuthMode(request, 'ok');
});

test('a gateway redirect-to-login falls back to anonymous browsing with a toast', async ({
  page,
  request,
}) => {
  // Baseline: the catalog loads normally.
  await page.goto('/apis');
  await expect(page.getByText('Tracks API', { exact: true })).toBeVisible({
    timeout: 30_000,
  });

  // Simulate the session dying: the "gateway" now 302s every API request to a
  // cross-origin login page. Reload so the app boots against the dead session
  // (the same detection covers in-page revalidation).
  await setAuthMode(request, 'expired-302');
  await page.reload();

  // The redirect is detected (as an opaque redirect — the fetch layer asks the
  // browser not to follow it) and surfaced as expiry: toast + anonymous
  // fallback, rather than a crash or silently-stale content.
  await expect(page.getByText(SESSION_EXPIRED_TOAST)).toBeVisible({
    timeout: 15_000,
  });
  // The app shell survives; the authed content is gone.
  await expect(page.getByText('APIs', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Tracks API', { exact: true })).not.toBeVisible();
  await page.screenshot({
    path: 'test-results/session-expired-302.png',
    fullPage: true,
  });

  // Once the "session" works again a reload recovers the catalog.
  await setAuthMode(request, 'ok');
  await page.reload();
  await expect(page.getByText('Tracks API', { exact: true })).toBeVisible({
    timeout: 30_000,
  });
});

test('a 401 for an anonymous visitor is not treated as session expiry', async ({
  page,
  request,
}) => {
  // Regression test: an anonymous visitor's 401s (e.g. the boot-time /me on a
  // mixed portal) must not trigger the expiry flow — there is no session to
  // expire, and reacting would (at minimum) show a nonsense toast.
  await setAuthMode(request, 'expired-401');

  const first401 = page.waitForResponse(
    (res) => res.url().includes('/v1/') && res.status() === 401,
  );
  await page.goto('/apis');
  await first401;

  // Give the expiry handler time to (wrongly) react before asserting silence.
  await page.waitForTimeout(2_000);
  await expect(page.getByText(SESSION_EXPIRED_TOAST)).not.toBeVisible();
  // The app shell still renders (no crash, just an empty catalog).
  await expect(page.getByText('APIs', { exact: true }).first()).toBeVisible();
  await page.screenshot({
    path: 'test-results/anonymous-401-no-toast.png',
    fullPage: true,
  });
});
