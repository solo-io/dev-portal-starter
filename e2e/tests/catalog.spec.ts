import { test, expect } from '@playwright/test';

test('APIs page, then API detail Redoc + Swagger views, against the built image', async ({
  page,
}) => {
  // 1. Navigate to the APIs page.
  await page.goto('/apis');

  // Wait for the API list to load — the mock portal serves 3 API products.
  // The app auto-detects as gloo-gateway and renders products from /v1/api-products.
  const tracksApi = page.getByText('Tracks API', { exact: true });
  const petstoreApi = page.getByText('Petstore API', { exact: true });
  const ordersApi = page.getByText('Orders API', { exact: true });

  await expect(tracksApi).toBeVisible({ timeout: 30_000 });
  await expect(petstoreApi).toBeVisible({ timeout: 10_000 });
  await expect(ordersApi).toBeVisible({ timeout: 10_000 });

  await page.screenshot({ path: 'test-results/apis-page.png', fullPage: true });

  // 2. Open the Tracks API detail page (card is a link to the Spec tab).
  await tracksApi.click();

  // 3. The Spec tab renders with Redoc by default. Redoc is a heavy bundle and
  //    renders its spec asynchronously, so wait for real spec content (the API
  //    title from the mock's OpenAPI doc) before capturing.
  await expect(
    page.getByRole('heading', { name: /Tracks REST API/i }),
  ).toBeVisible({ timeout: 60_000 });
  await page.screenshot({ path: 'test-results/redoc-view.png', fullPage: true });

  // 4. Toggle to the Swagger view and confirm the swagger-ui library renders.
  await page.getByRole('button', { name: /Swagger View/i }).click();
  const swaggerUi = page.locator('.swagger-ui');
  await expect(swaggerUi).toBeVisible({ timeout: 30_000 });
  // The operation summary from the mock spec confirms swagger-ui parsed it.
  await expect(page.getByText('List all tracks').first()).toBeVisible({
    timeout: 30_000,
  });
  await page.screenshot({ path: 'test-results/swagger-view.png', fullPage: true });
});
