import { Type } from "@sinclair/typebox";
import { loadRouteDefinitions, createRouteDefinition } from "./clientFactory";

const routeDefinitions = {
  getUser: createRouteDefinition({
    method: "GET",
    url: `/user/:id`,
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Array(
          Type.Object({
            name: Type.String(),
            age: Type.Number(),
          })
        ),
      },
    },
  }),
  getToken: createRouteDefinition({
    method: "GET",
    url: `/token`,
    schema: {
      querystring: Type.Object({ size: Type.String() }),
      response: {
        200: Type.String(),
      },
    },
  }),
  createUser: createRouteDefinition({
    method: "POST",
    url: `/user`,
    schema: {
      body: Type.Object({ name: Type.String() }),
      response: {
        200: Type.String(),
      },
    },
  }),
};

const [createClient, schema] = loadRouteDefinitions(routeDefinitions);

describe("Check requests parameters and response", () => {
  it("it should correctly call axios.request for a GET query with query parameters", async () => {
    const request = jest.fn((params) => {
      return { data: { name: "John Doe" } };
    });
    const client = createClient({ request, getUri: () => "" } as any);
    const user = await client.getUser({ params: { id: "toto" } }).call();

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: "/user/toto",
      method: "GET",
    });
    expect(user).toMatchObject({ name: "John Doe" });
  });

  it("it should correctly call axios.request with corrects parameters for a GET query without arguments", async () => {
    const request = jest.fn((params) => {
      return { data: "my-token" };
    });
    const client = createClient({ request, getUri: () => "" } as any);

    const token = await client.getToken({ query: { size: "20" } }).call();

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: "/token",
      method: "GET",
      params: { size: "20" },
    });
    expect(token).toBe("my-token");
  });

  it("it should correctly call axios.request on a POST query with a body", async () => {
    const request = jest.fn((params) => {
      return { data: { name: "John Doe" } };
    });
    const client = createClient({ request, getUri: () => "" } as any);

    const user = await client.createUser({ body: { name: "John Doe" } }).call();

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: "/user",
      method: "POST",
      data: { name: "John Doe" },
    });
    expect(user).toMatchObject({ name: "John Doe" });
  });
});
