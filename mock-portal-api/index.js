const express = require('express');
const { gmgApis, ggApiProducts, ggApiVersions, apiSchemas } = require('./data');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 31080;

// ---------------------------------------------------------------------------
// Middleware: CORS (allow cross-origin requests from the UI dev server)
// ---------------------------------------------------------------------------
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ---------------------------------------------------------------------------
// Middleware: log every request
// ---------------------------------------------------------------------------
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------------------------------------------------------------
// OAuth2 Token Endpoint
// POST /auth/realms/master/protocol/openid-connect/token
// ---------------------------------------------------------------------------
app.post('/auth/realms/:realm/protocol/openid-connect/token', (req, res) => {
  const { grant_type, client_id } = req.body;
  console.log(`  Token request: grant_type=${grant_type} client_id=${client_id}`);

  // Build a valid JWT so the provider can parse the exp claim.
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    sub: 'mock-service-account',
    iss: `http://localhost:${PORT}/auth/realms/${req.params.realm}`,
  })).toString('base64url');
  const mockJwt = `${header}.${payload}.mock-signature`;

  res.json({
    id_token: mockJwt,
    access_token: mockJwt,
    expires_in: 3600,
    'not-before-policy': 0,
    refresh_expires_in: 7200,
    refresh_token: 'mock-refresh-token',
    scope: 'openid profile email',
    session_state: 'mock-session-state',
    token_type: 'Bearer',
  });
});

// ---------------------------------------------------------------------------
// Bearer token check (permissive — just warns if missing)
// ---------------------------------------------------------------------------
function optionalAuth(req, _res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    console.log('  Warning: no Authorization header');
  }
  next();
}

// ---------------------------------------------------------------------------
// GMG: GET /v1/apis — returns flat API list (Gloo Mesh Gateway format)
// ---------------------------------------------------------------------------
app.get('/v1/apis', optionalAuth, (_req, res) => {
  res.json(gmgApis);
});

// ---------------------------------------------------------------------------
// GMG: GET /v1/apis/:apiId/schema — returns OpenAPI spec for a single API
// ---------------------------------------------------------------------------
app.get('/v1/apis/:apiId/schema', optionalAuth, (req, res) => {
  const spec = apiSchemas[req.params.apiId];
  if (!spec) {
    return res.status(404).json({ error: 'API not found' });
  }
  res.json(spec);
});

// ---------------------------------------------------------------------------
// GG: GET /v1/api-products — returns API product summaries (Gloo Gateway)
// ---------------------------------------------------------------------------
app.get('/v1/api-products', optionalAuth, (_req, res) => {
  res.json(ggApiProducts);
});

// ---------------------------------------------------------------------------
// GG: GET /v1/api-products/:id/versions — returns versions for a product
// ---------------------------------------------------------------------------
app.get('/v1/api-products/:id/versions', optionalAuth, (req, res) => {
  const versions = ggApiVersions[req.params.id];
  if (!versions) {
    return res.status(404).json({ error: 'API product not found' });
  }
  res.json(versions);
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Mock Portal API running on http://localhost:${PORT}`);
  console.log();
  console.log('Endpoints:');
  console.log(`  POST /auth/realms/{realm}/protocol/openid-connect/token`);
  console.log(`  GET  /v1/apis`);
  console.log(`  GET  /v1/apis/:apiId/schema`);
  console.log(`  GET  /v1/api-products`);
  console.log(`  GET  /v1/api-products/:id/versions`);
  console.log(`  GET  /health`);
  console.log();
});
