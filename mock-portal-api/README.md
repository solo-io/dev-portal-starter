# Mock Portal API

A lightweight mock server that implements the Gloo Platform Portal API endpoints consumed by `platform-portal-backstage-plugin-backend`.

## Quick Start

```bash
cd mock-portal-api
yarn install
yarn start
```

The server starts on `http://localhost:31080` (the plugin's default `portalServerUrl`).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/realms/{realm}/protocol/openid-connect/token` | OAuth2 token endpoint (returns mock tokens) |
| GET | `/v1/apis` | List APIs — Gloo Mesh Gateway (GMG) format |
| GET | `/v1/apis/:apiId/schema` | Get OpenAPI spec for an API |
| GET | `/v1/api-products` | List API products — Gloo Gateway (GG) format |
| GET | `/v1/api-products/:id/versions` | Get versions for an API product |
| GET | `/health` | Health check |

## Backstage Config

Point the plugin at this mock server in your `app-config.local.yaml`:

```yaml
glooPlatformPortal:
  backend:
    portalServerUrl: http://localhost:31080/v1
    tokenEndpoint: http://localhost:31080/auth/realms/master/protocol/openid-connect/token
    clientId: backstage
    clientSecret: mock-secret
```

## Customizing Mock Data

Edit `data.js` to add/modify APIs, API products, versions, and OpenAPI specs.
