import { test, expect } from '@playwright/test';
import { DEFAULT_PORTAL_MODE, setPortalMode } from '../portal-mode';

// The mock's "Webhooks API" is an OpenAPI 3.1 document with NO `paths` — only
// `webhooks` and `components`. `paths` is required in 3.0 but optional in 3.1,
// so the document must reach the renderers rather than be rejected into the
// "No schema found." empty state. That is the contract these tests hold.
//
// What the renderers actually do with it, pinned from observation:
//   - Redoc (the default view) renders it properly: the document title, an
//     "EVENT" sidebar group, and the webhook as a section badged "Webhook"
//     with its request body schema and responses.
//   - swagger-ui renders the webhook as a real POST operation under a
//     "Webhooks" section, but ALSO prints "No operations defined in spec!"
//     above it, because it reads that banner off `paths` alone. Misleading,
//     but it is swagger-ui's own behavior, not something the portal controls.
//   - The two flavors' headers disagree on the operation count: the legacy
//     header reads `paths ?? {}` and so shows "0 Operations", while the
//     gloo-gateway header is guarded on `paths` and omits the badge entirely.
//     Cosmetic, and pinned here so a change to either is noticed.

test.afterEach(async ({ request }) => {
  await setPortalMode(request, DEFAULT_PORTAL_MODE);
});

test('gloo-gateway flavor: a paths-less OpenAPI 3.1 document reaches both renderers', async ({
  page,
  request,
}) => {
  await setPortalMode(request, DEFAULT_PORTAL_MODE);
  await page.goto('/apis/webhooks-api');

  // 1. The load-bearing part: not the empty state, and Redoc mounted with this
  //    document's title.
  await expect(
    page.getByRole('heading', { name: 'Webhooks REST API (1.0.0)' }),
  ).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText('No schema found.')).toHaveCount(0);
  await expect(
    page.getByText('There was an issue displaying the API Product details'),
  ).toHaveCount(0);
  await expect(page.locator('[aria-label="Schema Display"]')).toBeVisible();

  // 2. Redoc renders the webhook itself, not just the title.
  await expect(
    page.getByRole('heading', { name: /Track published event/ }),
  ).toBeVisible();
  await expect(page.getByText('Event acknowledged')).toBeVisible();
  // No operation count badge on this flavor — the header guards it on `paths`.
  await expect(page.getByText(/\d+ Operations/)).toHaveCount(0);
  await page.screenshot({
    path: 'test-results/webhooks-only-gg-redoc.png',
    fullPage: true,
  });

  // 3. The Swagger view renders the webhook as a POST operation, under its own
  //    "Webhooks" section, alongside swagger-ui's misleading empty-paths banner.
  await page.getByRole('button', { name: /Swagger View/i }).click();
  await expect(page.locator('.swagger-ui')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('No operations defined in spec!')).toBeVisible();
  const opblock = page.locator('.opblock');
  await expect(opblock).toHaveCount(1);
  await expect(opblock).toContainText('trackPublished');
  await expect(opblock.locator('.opblock-summary-method')).toHaveText('POST');
  await page.screenshot({
    path: 'test-results/webhooks-only-gg-swagger.png',
    fullPage: true,
  });
});

test('legacy flavor: a paths-less OpenAPI 3.1 document reaches the renderer', async ({
  page,
  request,
}) => {
  await setPortalMode(request, {
    flavor: 'gloo-mesh-gateway',
    schema: 'object',
  });
  await page.goto('/apis/webhooks-api-v1');

  await expect(
    page.getByRole('heading', { name: 'Webhooks REST API (1.0.0)' }),
  ).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText('No schema found.')).toHaveCount(0);
  await expect(page.locator('[aria-label="Schema Display"]')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Track published event/ }),
  ).toBeVisible();
  // The legacy header counts `paths ?? {}`, so a paths-less document reads
  // "0 Operations" rather than dropping the badge.
  await expect(page.getByText('0 Operations')).toBeVisible();
  await page.screenshot({
    path: 'test-results/webhooks-only-gmg-redoc.png',
    fullPage: true,
  });
});
