import { test, expect } from '@playwright/test';
import { DEFAULT_PORTAL_MODE, setPortalMode } from '../portal-mode';

// Covers the API detail page on the legacy ("gloo-mesh-gateway") portal flavor,
// which serves its OpenAPI document from /v1/apis/:apiId/schema. Portal v1
// sends that document as a JSON string, and the page used to die on it — see
// solo-io/solo-projects#9218. The mock's /__test/portal-mode control selects
// the flavor and how the schema is delivered (mock-portal-api/index.js).

const TRACKS_DETAIL_LINK = 'a[href="/apis/tracks-api-v1"]';

// The portal mode is global state in the mock server; always restore it so a
// failure here can't poison other specs.
test.afterEach(async ({ request }) => {
  await setPortalMode(request, DEFAULT_PORTAL_MODE);
});

// Opens the Tracks API from the legacy catalog. Reaching the detail page via
// the card link also proves the legacy list rendered.
async function openTracksApi(page: import('@playwright/test').Page) {
  await page.goto('/apis');
  const tracksLink = page.locator(TRACKS_DETAIL_LINK);
  await expect(tracksLink).toBeVisible({ timeout: 30_000 });
  await tracksLink.click();
  await expect(page).toHaveURL(/\/apis\/tracks-api-v1$/);
}

// Redoc renders each operation's summary as a heading in the content area.
async function expectOperationsRendered(page: import('@playwright/test').Page) {
  await expect(
    page.getByRole('heading', { name: 'List all tracks' }),
  ).toBeVisible({ timeout: 60_000 });
  await expect(
    page.getByRole('heading', { name: 'Get a track by ID' }),
  ).toBeVisible();
}

test('legacy flavor: an API product\'s operations render on the detail page', async ({
  page,
  request,
}) => {
  await setPortalMode(request, {
    flavor: 'gloo-mesh-gateway',
    schema: 'object',
  });
  await openTracksApi(page);

  // The header counts the spec's operations — it reads `paths`, so it is the
  // first thing to break on a spec the page failed to resolve.
  await expect(page.getByText('2 Operations')).toBeVisible({ timeout: 60_000 });
  await expectOperationsRendered(page);
  await page.screenshot({
    path: 'test-results/gmg-operations-object-spec.png',
    fullPage: true,
  });
});

test('legacy flavor: a spec delivered as a JSON string still renders', async ({
  page,
  request,
}) => {
  await setPortalMode(request, {
    flavor: 'gloo-mesh-gateway',
    schema: 'string',
  });
  await openTracksApi(page);

  // Before the fix the string went through untouched, `Object.keys(undefined)`
  // threw during render, and the route's ErrorBoundary replaced the page.
  await expect(
    page.getByText('There was an issue displaying the API Product details'),
  ).toHaveCount(0);
  await expect(page.getByText('2 Operations')).toBeVisible({ timeout: 60_000 });
  await expectOperationsRendered(page);
  await page.screenshot({
    path: 'test-results/gmg-operations-string-spec.png',
    fullPage: true,
  });
});

test('legacy flavor: an unresolvable spec shows an empty state', async ({
  page,
  request,
}) => {
  await setPortalMode(request, {
    flavor: 'gloo-mesh-gateway',
    schema: 'missing',
  });
  await page.goto('/apis/tracks-api-v1');

  await expect(page.getByText('No schema found.')).toBeVisible({
    timeout: 60_000,
  });
  await expect(
    page.getByText(
      'The portal server returned no usable OpenAPI spec for this API.',
    ),
  ).toBeVisible();
  // No spec renderer is mounted, so the page can't sit on Redoc's "Loading ..."
  // placeholder, and there is nothing to toggle to the Swagger view.
  await expect(page.locator('[aria-label="Schema Display"]')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: /Swagger View/i }),
  ).toHaveCount(0);
  await page.screenshot({
    path: 'test-results/gmg-no-schema-empty-state.png',
    fullPage: true,
  });
});
