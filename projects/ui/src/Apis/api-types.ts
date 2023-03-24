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
};

export type API = {
  apiId: string;
  title: string;
  description: string;
  termsOfService: string;
  contact: string;
  license: string;
  usagePlans: string[];
};

type SchemaPropertyType = "string" | "integer" | "array" | "object";
export type APISchema = {
  components: {
    schemas: {
      Author?: {
        properties: { [key: string]: SchemaPropertyType }; //Could hardcode props-list if desired
        type: "object";
      };
      Module?: {
        properties: { [key: string]: SchemaPropertyType }; //Could hardcode props-list if desired
        type: "object";
      };
      Track?: {
        properties: { [key: string]: SchemaPropertyType }; //Could hardcode props-list if desired
        type: "object";
      };
    };
  };
  info: {
    title: string;
    version: string;
  };
  paths: {
    [key: string]: any; // We should define this much better as its pretty limited
  };
  servers: {
    url: string;
  }[];
};
