// -------------------------------------------------------
// Mock data for the Gloo Platform Portal API
// -------------------------------------------------------

const openApiSpec = {
  info: { title: "Tracks REST API", version: "1.0.0" },
  servers: [{ url: "http://localhost:8080" }],
  paths: {
    "/tracks": {
      get: {
        summary: "List all tracks",
        operationId: "listTracks",
        responses: { 200: { description: "A list of tracks" } },
      },
    },
    "/tracks/{id}": {
      get: {
        summary: "Get a track by ID",
        operationId: "getTrack",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "A single track" } },
      },
    },
  },
  components: {
    schemas: {
      Track: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          author: { type: "string" },
          duration: { type: "integer" },
        },
      },
      Author: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
      },
    },
  },
};

const ordersSpec = {
  info: { title: "Orders API", version: "1.0.0" },
  servers: [{ url: "http://localhost:31080" }],
  paths: {
    "/orders": {
      get: {
        summary: "List all orders",
        operationId: "listOrders",
        responses: { 200: { description: "A list of orders" } },
      },
      post: {
        summary: "Create an order",
        operationId: "createOrder",
        responses: { 201: { description: "Order created" } },
      },
    },
    "/orders/{id}": {
      get: {
        summary: "Get an order by ID",
        operationId: "getOrder",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "A single order" } },
      },
    },
  },
  components: {
    schemas: {
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          product: { type: "string" },
          quantity: { type: "integer" },
          status: { type: "string" },
        },
      },
    },
  },
};

const petStoreSpec = {
  info: { title: "Petstore API", version: "2.0.0" },
  servers: [{ url: "http://localhost:31080" }],
  paths: {
    "/pets": {
      get: {
        summary: "List all pets",
        operationId: "listPets",
        responses: { 200: { description: "A list of pets" } },
      },
      post: {
        summary: "Create a pet",
        operationId: "createPet",
        responses: { 201: { description: "Pet created" } },
      },
    },
  },
  components: {
    schemas: {
      Pet: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          species: { type: "string" },
        },
      },
    },
  },
};

// ----- GMG (Gloo Mesh Gateway) format: flat API list -----

const gmgApis = [
  {
    apiProductId: "tracks-api",
    apiProductDisplayName: "Tracks API",
    apiVersion: "v1",
    apiId: "tracks-api-v1",
    contact: "platform-team@example.com",
    customMetadata: { team: "platform", tier: "internal" },
    description: "REST API for managing music tracks",
    license: "MIT",
    termsOfService: "https://example.com/tos",
    title: "Tracks REST API",
    usagePlans: ["gold", "silver"],
    openapiSpec: openApiSpec,
    openapiSpecFetchErr: null,
  },
  {
    apiProductId: "petstore-api",
    apiProductDisplayName: "Petstore API",
    apiVersion: "v2",
    apiId: "petstore-api-v2",
    contact: "petstore-team@example.com",
    customMetadata: { team: "petstore" },
    description: "Petstore sample API",
    license: "Apache-2.0",
    termsOfService: "https://example.com/tos",
    title: "Petstore API",
    usagePlans: ["free", "gold"],
    openapiSpec: petStoreSpec,
    openapiSpecFetchErr: null,
  },
  {
    apiProductId: "orders-api",
    apiProductDisplayName: "Orders API",
    apiVersion: "v1",
    apiId: "orders-api-v1",
    contact: "commerce-team@example.com",
    customMetadata: { team: "commerce" },
    description: "REST API for managing orders",
    license: "MIT",
    termsOfService: "https://example.com/tos",
    title: "Orders API",
    usagePlans: ["gold"],
    openapiSpec: ordersSpec,
    openapiSpecFetchErr: null,
  },
];

// ----- GG (Gloo Gateway) format: API products + versions -----

const ggApiProducts = [
  {
    createdAt: "2024-01-15T10:00:00Z",
    description: "REST API for managing music tracks",
    id: "tracks-api",
    name: "Tracks API",
    updatedAt: "2024-06-01T12:00:00Z",
    versionsCount: 1,
  },
  {
    createdAt: "2024-03-20T08:00:00Z",
    description: "Petstore sample API",
    id: "petstore-api",
    name: "Petstore API",
    updatedAt: "2024-05-15T09:30:00Z",
    versionsCount: 1,
  },
  {
    createdAt: "2024-05-01T10:00:00Z",
    description: "REST API for managing orders",
    id: "orders-api",
    name: "Orders API",
    updatedAt: "2024-06-10T08:00:00Z",
    versionsCount: 1,
  },
];

const ggApiVersions = {
  "tracks-api": [
    {
      apiSpec: openApiSpec,
      createdAt: "2024-01-15T10:00:00Z",
      documentation: "Full documentation for Tracks API v1",
      id: "tracks-api-v1",
      name: "v1",
      publicVisible: true,
      status: "APPROVED",
      title: "Tracks REST API v1",
      updatedAt: "2024-06-01T12:00:00Z",
    },
  ],
  "petstore-api": [
    {
      apiSpec: petStoreSpec,
      createdAt: "2024-03-20T08:00:00Z",
      documentation: "Full documentation for Petstore API v2",
      id: "petstore-api-v2",
      name: "v2",
      publicVisible: true,
      status: "APPROVED",
      title: "Petstore API v2",
      updatedAt: "2024-05-15T09:30:00Z",
    },
  ],
  "orders-api": [
    {
      apiSpec: ordersSpec,
      createdAt: "2024-05-01T10:00:00Z",
      documentation: "Full documentation for Orders API v1",
      id: "orders-api-v1",
      name: "v1",
      publicVisible: true,
      status: "APPROVED",
      title: "Orders API v1",
      updatedAt: "2024-06-10T08:00:00Z",
    },
  ],
};

// Map apiId -> OpenAPI spec for the /apis/:apiId/schema endpoint
const apiSchemas = {
  "tracks-api-v1": openApiSpec,
  "petstore-api-v2": petStoreSpec,
  "orders-api-v1": ordersSpec,
};

module.exports = {
  gmgApis,
  ggApiProducts,
  ggApiVersions,
  apiSchemas,
};
