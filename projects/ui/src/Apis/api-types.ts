/* BASED ON:
  schemas:
    User:
      properties:
        id:
          example: 1311ebc09c6d22b207949679
          type: string
        name:
          example: John Doe
          type: string
        email:
          example: 123@email.com
          type: string
        username:
          example: exampleUser
          type: string
      type: object
    UsagePlan:
      properties:
        name:
          example: bronze plan
          type: string
        authPolicies:
          type: array
          items:
            type: object
            properties:
              authType:
                type: string
                example: apiKeyAuth
        rateLimitPolicy:
          type: object
          properties:
            unit:
              type: string
              example: MINUTE
            requestsPerUnit:
              type: integer
              example: 1
        apiIds:
          type: array
          items:
            type: string
            example: petstoreAPI-petstoreNamespace-cluster-1
      type: object
    APIKey:
      properties:
        apiId:
          type: string
          example: petstoreAPI-petstoreNamespace-cluster1
        apiKey:
          example: 3be5a92cb7598f4f48c6d68688b10e5bfa3cbbc2a512c7ba9fcfe22c3eab971a
          type: string
    API:
      properties:
        apiId:
          example: petstoreAPI-petstoreNamespace-cluster-1
          type: string
        title:
          example: pet store
          type: string
        description:
          example: "list of pet store apis"
          type: string
        termsOfService:
          example: "example terms of service"
          type: string
        contact:
          example: "123@email.com"
          type: string
        license:
          example: "MIT"
          type: string
        usagePlans:
          type: array
          items:
            type: string
          example: ["bronze plan", "silver plan", "gold plan"]
        customMetadata:
          type: object
          example: {
            "category": ["orders", "customers"],
          }
      type: object
*/

/* NOTE: This should be taken out before public release for a 
     version which is run off of types generated somehow from our 
     private backend */

export type apiId = string;

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
};

export type UsagePlan = {
  name: string;
  authPolicies: {
    authType: string;
  }[];
  rateLimitPolicy: {
    unit: string;
    requestsPerUnit: number;
  };
  apiIds: apiId[];
};

export type APIKey = {
  apiId: apiId;
  apiKey: string;
};

export type API = {
  apiId: string;
  title: string;
  description: string;
  termsOfService: string;
  contact: string;
  license: string;
  usagePlans: string[];
  customMetadata: { [key: string]: any };
};
