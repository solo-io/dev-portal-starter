import { APIRequestContext, expect } from '@playwright/test';

// The mock portal API's test-only /__test/portal-mode control: it pins which
// portal server flavor the UI sniffs, and how that flavor's endpoint delivers
// its OpenAPI document. See mock-portal-api/index.js.

const MOCK_API_URL = `http://localhost:${process.env.E2E_MOCK_API_PORT || '31080'}`;

export type PortalMode = {
  flavor: 'gloo-gateway' | 'gloo-mesh-gateway';
  schema: 'object' | 'string' | 'malformed' | 'missing';
};

export const DEFAULT_PORTAL_MODE: PortalMode = {
  flavor: 'gloo-gateway',
  schema: 'object',
};

export async function setPortalMode(
  request: APIRequestContext,
  mode: PortalMode,
) {
  const res = await request.post(`${MOCK_API_URL}/__test/portal-mode`, {
    data: mode,
  });
  expect(res.ok()).toBeTruthy();
}
