import { test, expect } from '@playwright/test';

test('APIs page shows all APIs from the mock portal', async ({ page }) => {
  // Navigate to the APIs page
  await page.goto('/apis');

  // Wait for the API list to load — the mock portal serves 3 API products.
  // The app auto-detects as gloo-gateway and renders products from /v1/api-products.
  const tracksApi = page.getByText('Tracks API', { exact: true });
  const petstoreApi = page.getByText('Petstore API', { exact: true });
  const ordersApi = page.getByText('Orders API', { exact: true });

  await expect(tracksApi).toBeVisible({ timeout: 30_000 });
  await expect(petstoreApi).toBeVisible({ timeout: 10_000 });
  await expect(ordersApi).toBeVisible({ timeout: 10_000 });

  // Capture a screenshot of the loaded APIs page
  await page.screenshot({ path: 'test-results/apis-page.png', fullPage: true });
});
