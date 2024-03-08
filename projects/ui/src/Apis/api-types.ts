/**
 * Some basic types modeling the data received from the backend.
 *   These could be expanded on for different usage, especially
 *   within the Schema.
 */

export type User = {
  name: string;
  email: string;
  username: string;
  // TODO: Once auth is working, check if we can get admin info here and update the areas that use admin endpoints (e.g. subscriptions areas).
  // admin: string;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// TODO: Remove these old types and update API pages.
export type APIVersion = {
  apiId: string;
  apiVersion: string;
  contact: string;
  customMetadata?: Record<string, string>;
  description: string;
  license: string;
  termsOfService: string;
  title: string;
  usagePlans: string[];
};
export type APIProduct = {
  apiProductId: string;
  apiProductDisplayName: string;
  apiVersions: APIVersion[];
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type ApiProductSummary = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  description: string;
  versionsCount: number;
};

export type ApiProductDetails = Omit<ApiProductSummary, "versionsCount"> & {
  // Inherited fields, same as ApiProductSummary
  // id: string;
  // createdAt: string;
  // updatedAt: string;
  // deletedAt: string;
  // name: string;
  // description: string;
  autoApproval: boolean;
  contactEmail: string;
  metadata: Record<string, string>;
  public: boolean;
  versions: ApiVersion[];
  subscriptions: Subscription[];
};

export type ApiVersion = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  title: string;
  documentation: string;
  termsOfService: string;
  license: string;
  lifecycle: string;
  status: string; // 'published',
  backingService: string;
  apiSpec: string;
  visible: boolean;
  oauthEnabled: boolean;
  apiKeyEnabled: boolean;
  public: boolean;
  metadata: Record<string, string>;
  apiProductId: string;
};

export type App = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  description: string;
  idpClientName: string;
  idpClientId: string;
  idpClientSecret: string;
  teamId: string;
};

export type Team = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  description: string;
};

export type Member = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  email: string;
  name: string;
  username: string;
  synced: boolean;
};

export enum SubscriptionStatus {
  APPROVED = "approved",
  PENDING = "pending",
}
export type Subscription = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  requestedAt: string;
  approved: boolean;
  approvedAt: string;
  applicationId: string;
  apiProductId: string;
  usagePlanId: string;
};

export type ErrorMessageResponse = {
  message: string;
};

type SchemaPropertyType = "string" | "integer" | "array" | "object";
export type APISchema = {
  components?: {
    schemas: {
      Author?: {
        properties: { [key: string]: SchemaPropertyType };
        type: "object";
      };
      Module?: {
        properties: { [key: string]: SchemaPropertyType };
        type: "object";
      };
      Track?: {
        properties: { [key: string]: SchemaPropertyType };
        type: "object";
      };
    };
  };
  info: {
    title: string;
    version: string;
  };
  paths: {
    [key: string]: unknown;
  };
  servers?: {
    url: string;
  }[];
};

//
// Response from keycloak.
//
export interface AccessTokensResponse {
  id_token: string;
  access_token: string;
  expires_in: number;
  "not-before-policy": number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
}
