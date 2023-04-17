/**
 * Some basic types modeling the data received from the backend.
 *   These could be expanded on for different usage, especially
 *   within the Schema.
 */

export type User = {
  name: string;
  email: string;
  username: string;
};

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
  apiId: string;
  contact: string;
  customMetadata: Record<string, string> | undefined;
  description: string;
  license: string;
  termsOfService: string;
  title: string;
  usagePlans: string[];
};

type SchemaPropertyType = "string" | "integer" | "array" | "object";
export type APISchema = {
  components: {
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
  servers: {
    url: string;
  }[];
};
