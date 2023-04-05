/**
 * Some basic types modeling the data received from the backend.
 *   These could be expanded on for different usage, especially
 *   within the Schema.
 */

export type apiId = string;

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
};

export type RateLimitUnit = "SECOND" | "MINUTE" | "HOUR";
export type UsagePlan = {
  name: string;
  authPolicies: {
    authType: string;
  }[];
  rateLimitPolicy: {
    unit: RateLimitUnit;
    requestsPerUnit: number;
  };
  apiIds: apiId[];
};

export type APIKey = {
  apiId: apiId;
  apiKey?: string;
  customMetadata?: Map<string, string>;
};

export type API = {
  apiId: string;
  title: string;
  description: string;
  termsOfService: string;
  contact: string;
  license: string;
  usagePlans: string[];
  customMetadata: Map<string, string>;
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
