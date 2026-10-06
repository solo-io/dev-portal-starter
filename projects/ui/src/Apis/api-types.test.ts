import { describe, expect, it } from "vitest";
import { normalizeApiVersionSchema } from "./api-types";

const spec = { openapi: "3.0.0", paths: { "/tracks": { get: {} } } };

describe("normalizeApiVersionSchema", () => {
  it("passes an object spec through", () => {
    expect(normalizeApiVersionSchema(spec)).toBe(spec);
  });

  it("parses a JSON string spec, as portal v1 sends it", () => {
    expect(normalizeApiVersionSchema(JSON.stringify(spec))).toEqual(spec);
  });

  it("returns undefined for an unparseable string", () => {
    expect(normalizeApiVersionSchema("openapi: 3.0.0\npaths: {}")).toBeUndefined();
  });

  it("returns undefined when there is no spec", () => {
    expect(normalizeApiVersionSchema(undefined)).toBeUndefined();
  });

  it("returns undefined for JSON that is not an OpenAPI document", () => {
    expect(normalizeApiVersionSchema('{"error":"not found"}')).toBeUndefined();
    expect(normalizeApiVersionSchema("null")).toBeUndefined();
    expect(normalizeApiVersionSchema("[]")).toBeUndefined();
  });

  // `paths` is required in OpenAPI 3.0 but optional in 3.1, so a document
  // without it is still renderable and must not fall into the empty state.
  it("keeps an OpenAPI 3.1 document that has no paths", () => {
    const webhooksOnly = {
      openapi: "3.1.0",
      webhooks: { newPet: { post: {} } },
    };
    expect(normalizeApiVersionSchema(webhooksOnly)).toBe(webhooksOnly);
    expect(
      normalizeApiVersionSchema(JSON.stringify(webhooksOnly))
    ).toEqual(webhooksOnly);
    expect(
      normalizeApiVersionSchema({ components: { schemas: {} } })
    ).toBeDefined();
  });
});
