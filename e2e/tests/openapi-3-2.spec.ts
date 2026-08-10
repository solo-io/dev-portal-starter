import { test, expect } from '@playwright/test';

// Validates how the two spec renderers handle an OpenAPI 3.2 document (the
// mock's "Search API"), pinning what is and isn't supported today:
//
//   - Redoc (the default view) accepts the 3.2 version string but models the
//     document as 3.1, so it renders the doc while silently dropping the
//     3.2-only QUERY operation.
//   - swagger-ui (>= 5.32) renders the QUERY operation as a real operation.
//
// If the Redoc assertions here start failing after a redoc upgrade, that
// likely means redoc gained real 3.2 support — update this test (and remove
// the caveats it documents) rather than pinning the old behavior.
test('OpenAPI 3.2 spec: Redoc renders as 3.1 (QUERY dropped), Swagger renders QUERY', async ({
  page,
}) => {
  // 1. The 3.2-spec'd product is listed alongside the 3.0 ones.
  await page.goto('/apis');
  const searchApi = page.getByText('Search API', { exact: true });
  await expect(searchApi).toBeVisible({ timeout: 30_000 });

  // 2. Open it. Redoc renders by default; the spec title appearing proves the
  //    3.2 document was accepted rather than rejected with
  //    "Unsupported OpenAPI version: 3.2.0".
  await searchApi.click();
  await expect(
    page.getByRole('heading', { name: /Search REST API/i }),
  ).toBeVisible({ timeout: 60_000 });

  // The plain GET operations from the same document render. (Assert on the
  // content-area headings: the sidebar copies of these summaries are inside
  // the collapsed "search" tag group, so they exist but are hidden.)
  await expect(
    page.getByRole('heading', { name: 'List saved searches' }),
  ).toBeVisible({ timeout: 30_000 });
  await expect(
    page.getByRole('heading', { name: 'Stream search results' }),
  ).toBeVisible();

  // ...but the QUERY operation is silently omitted (Redoc iterates a fixed
  // verb list that predates OpenAPI 3.2). This is the known limitation.
  await expect(page.getByText('Search the catalog')).toHaveCount(0);

  // Redoc ignores the tags' parent/kind fields: "catalog" and "search"
  // render as flat sibling sections rather than nested. (A tag heading's
  // accessible name includes its anchor link, e.g. "tag/catalog catalog".)
  await expect(
    page.getByRole('heading', { name: 'tag/catalog catalog' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'tag/search search' }),
  ).toBeVisible();
  await page.screenshot({
    path: 'test-results/openapi-3-2-redoc.png',
    fullPage: true,
  });

  // 3. The Swagger view renders the QUERY operation fully.
  await page.getByRole('button', { name: /Swagger View/i }).click();
  await expect(page.locator('.swagger-ui')).toBeVisible({ timeout: 30_000 });

  const queryOpblock = page.locator('.opblock-query');
  await expect(queryOpblock).toBeVisible({ timeout: 30_000 });
  await expect(queryOpblock.locator('.opblock-summary-method')).toHaveText(
    'QUERY',
  );
  await expect(page.getByText('Search the catalog').first()).toBeVisible();

  // 4. Hierarchical tags (3.2's parent/kind): swagger-ui parses them (its
  //    ApiDOM layer models parent/kind) but renders them FLAT — the
  //    "catalog" parent appears as an empty section and the "search" child
  //    is its sibling, not nested inside it. Asserted structurally on the
  //    DOM so a future swagger-ui that starts nesting fails this pin.
  await expect(page.locator('a[href="#/catalog"]')).toBeVisible();
  await expect(page.locator('a[href="#/search"]')).toBeVisible();
  const tagLayout = await page.evaluate(() => {
    const catalogSection = document
      .querySelector('a[href="#/catalog"]')
      ?.closest('.opblock-tag-section');
    const searchLink = document.querySelector('a[href="#/search"]');
    return {
      searchNestedInCatalog:
        !!searchLink && !!catalogSection?.contains(searchLink),
    };
  });
  expect(tagLayout).toEqual({ searchNestedInCatalog: false });
  await page.screenshot({
    path: 'test-results/openapi-3-2-swagger.png',
    fullPage: true,
  });
});
