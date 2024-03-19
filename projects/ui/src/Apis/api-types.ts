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

export type ApiProductSummary = {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  updatedAt: string;
  versionsCount: number;
};

export type ApiProductDetails = {
  autoApproval: boolean;
  contactEmail: string;
  createdAt: string;
  description: string;
  id: string;
  metadata: Record<string, string> | null;
  name: string;
  updatedAt: string;
};

export type ApiVersion = {
  apiSpec?: string | ApiVersionSchema;
  createdAt: string;
  documentation: string;
  id: string;
  name: string;
  publicVisible?: boolean;
  status: string; // 'published',
  title: string;
  updatedAt: string;
};

export type App = {
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  id: string;
  idpClientId: string;
  idpClientName: string;
  idpClientSecret: string;
  name: string;
  description: string;
  teamId: string;
};

export type Team = {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  updatedAt: string;
};

export type Member = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  username: string;
  // synced = has user logged in.
  synced: boolean;
  updatedAt: string;
};

export enum SubscriptionStatus {
  APPROVED = "approved",
  PENDING = "pending",
}
export type Subscription = {
  apiProductId: string;
  applicationId: string;
  approved?: boolean;
  approvedAt?: string;
  rejected?: boolean;
  rejectedAt?: string;
  createdAt?: string;
  deletedAt?: string;
  id: string;
  requestedAt: string;
  updatedAt: string;
};

export type ErrorMessageResponse = {
  message: string;
};

type SchemaPropertyType = "string" | "integer" | "array" | "object";
export type ApiVersionSchema = {
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
  info?: {
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
