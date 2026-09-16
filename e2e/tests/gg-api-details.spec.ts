import { test, expect } from '@playwright/test';
import { DEFAULT_PORTAL_MODE, setPortalMode } from '../portal-mode';

// Covers the API Product detail page on the "gloo-gateway" (GG v2 / kgateway)
// flavor, where each version from /v1/api-products/:id/versions carries its
// OpenAPI document inline as `apiSpec`. The mock's /__test/portal-mode control
// selects how that document is delivered (mock-portal-api/index.js).

// The portal mode is global state in the mock server; always restore it so a
// failure here can't poison other specs.
test.afterEach(async ({ request }) => {
  await setPortalMode(request, DEFAULT_PORTAL_MODE);
});

test('gloo-gateway flavor: a spec delivered as a JSON string still renders', async ({
  page,
  request,
}) => {
  await setPortalMode(request, { flavor: 'gloo-gateway', schema: 'string' });
  await page.goto('/apis/tracks-api');

  // The header's operation count reads `paths`, so it is the first thing to
  // break on a spec the page failed to resolve.
  await expect(page.getByText('2 Operations')).toBeVisible({ timeout: 60_000 });
  await expect(
    page.getByRole('heading', { name: 'List all tracks' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Get a track by ID' }),
  ).toBeVisible();
  await page.screenshot({
    path: 'test-results/gg-operations-string-spec.png',
    fullPage: true,
  });
});

test('gloo-gateway flavor: a malformed spec shows the schema empty state', async ({
  page,
  request,
}) => {
  await setPortalMode(request, { flavor: 'gloo-gateway', schema: 'malformed' });
  await page.goto('/apis/tracks-api');

  // An unguarded JSON.parse used to throw here and the route's ErrorBoundary
  // replaced the whole page; an unusable spec now falls to the empty state.
  await expect(page.getByText('No schema found.')).toBeVisible({
    timeout: 60_000,
  });
  await expect(
    page.getByText('The schema was not returned for this'),
  ).toBeVisible();
  await expect(
    page.getByText('There was an issue displaying the API Product details'),
  ).toHaveCount(0);
  // No renderer is mounted, so there is nothing to toggle to the Swagger view.
  await expect(page.locator('[aria-label="Schema Display"]')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: /Swagger View/i }),
  ).toHaveCount(0);
  await page.screenshot({
    path: 'test-results/gg-malformed-spec-empty-state.png',
    fullPage: true,
  });
});
