//
// Gloo Mesh Gateway Types
//

type RateLimitPolicy = {
  unit: "UNKNOWN" | "SECOND" | "MINUTE" | "HOUR" | "DAY";
  requestsPerUnit: number;
};

type AuthPolicy = {
  authType: string;
};

export type UsagePlan = {
  name: string;
  authPolicies: AuthPolicy[];
  rateLimitPolicy: RateLimitPolicy;
  apiIds: string[];
};

export type APIKey = {
  name: string;
  id: string;
  // APIKey is returned only once when the API key is created.
  apiKey: string | undefined;
  metadata?: Record<string, string> | undefined;
};

export type API = {
  apiProductId?: string;
  apiProductDisplayName?: string;
  apiVersion?: string;
  apiId: string;
  contact: string;
  customMetadata: Record<string, string> | undefined;
  description: string;
  license: string;
  termsOfService: string;
  title: string;
  usagePlans: string[];
};

// This api type may be returned in the next portal rest server version.
export type APIProduct = {
  apiProductId: string;
  apiProductDisplayName: string;
  apiVersions: {
    apiId: string;
    apiVersion: string;
    contact: string;
    customMetadata?: Record<string, string>;
    description: string;
    license: string;
    termsOfService: string;
    title: string;
    usagePlans: string[];
  }[];
};

//
// Gloo Gateway Types
//

export type ApiProductSummary = {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  updatedAt: string;
  versionsCount: number;
  apiProductMetadata?: Record<string, string>;
};

export type ApiProductDetails = {
  autoApproval: boolean;
  contactEmail: string;
  createdAt: string;
  description: string;
  id: string;
  apiProductMetadata: Record<string, string> | null;
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
  productVersionMetadata?: Record<string, string>;
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

export type ApiKey = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  apiKey: string;
  name: string;
  metadata: Record<string, string>;
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
  deletedAt?: string;
};

export enum SubscriptionStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
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

export type ApiVersionExtended = ApiVersion & {
  apiProductDescription: string;
  apiProductName: string;
};

export type OauthCredential = {
  id: string;
  idpClientId: string;
  idpClientSecret: string;
  idpClientName: string;
};

//
// Shared Types
//

export type User = {
  name: string;
  email: string;
  username: string;
  // isAdmin may be undefined on older versions of the gg portal server.
  isAdmin?: string;
};

/**
 * This is an error message that is returned by the useMultiSwrWithAuth function.
 * Since it includes multiple requests, it wouldn't be a good UX to throw an error if one fails.
 * Instead we can filter on isError and show the results that succeeded.
 */
export type ErrorMessageResponse = {
  isError: true;
  message: string;
};

export const isErrorMessageResponse = <T>(value: T | ErrorMessageResponse) =>
  value !== null &&
  typeof value === "object" &&
  "isError" in value &&
  !!value.isError;

/**
 * This may be returned from the subscriptions list endpoint, and if so is an error.
 */
export type SubscriptionsListError = { message: string };

export const isSubscriptionsListError = (
  s: SubscriptionsListError | Subscription[] | undefined
) => !!s && typeof s === "object" && "message" in s;

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
