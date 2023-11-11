import { Type } from "@sinclair/typebox";
import { createClient, createRoute } from "./proxyFactory";
import { TypeBoxTypeProvider } from "./TypeboxProvider";

const getEasy = createRoute("/easy", {
  method: "GET",
  schema: {
    response: {
      200: Type.Array(
        Type.Object({
          name: Type.String(),
          age: Type.Number(),
        })
      ),
    },
  },
}).handle(() => {});

const getUser = createRoute("/user/:id", {
  method: "GET",
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
}).handle(() => {});

const getToken = createRoute("/token", {
  method: "GET",
  schema: {
    querystring: Type.Object({ size: Type.String() }),
    response: {
      200: Type.String(),
    },
  },
}).handle(() => {});

const createUser = createRoute("/user", {
  method: "POST",
  schema: {
    body: Type.Object({ name: Type.String() }),
    response: {
      200: Type.String(),
    },
  },
}).handle(() => {});

const routes = { ...getUser, ...getToken, ...createUser, ...getEasy };

type Router = typeof routes;

const client = createClient<Router, TypeBoxTypeProvider>({} as any);

describe("Check requests parameters and response", () => {
  it("it should correctly call axios.request for a GET query with query parameters", async () => {
    const request = jest.fn((params) => {
      return { data: { name: "John Doe" } };
    });
    const client = createClient<Router, TypeBoxTypeProvider>({
      instance: { request, getUri: () => "/user/toto" },
    } as any);

    const user = await client
      .ref("[GET]/user/:id")
      .query({ params: { id: "toto" } });

    const url = await client.route("[GET]/user/:id", { params: { id: "toto" } })
      .url;

    const urld = await client
      .ref("[GET]/user/:id")
      .url({ params: { id: "toto" } });

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: "/user/toto",
      method: "GET",
    });
    expect(url).toBe("/user/toto");
    expect(user).toMatchObject({ name: "John Doe" });
  });

  it("it should correctly call axios.request with corrects parameters for a GET query without arguments", async () => {
    const request = jest.fn((params) => {
      return { data: "my-token" };
    });
    const client = createClient<Router, TypeBoxTypeProvider>({
      instance: { request, getUri: () => "" },
    } as any);

    const token = await client
      .route("[GET]/token", { query: { size: "20" } })
      .query();

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
    const client = createClient<Router, TypeBoxTypeProvider>({
      instance: { request, getUri: () => "" },
    } as any);

    const user = await client
      .route("[POST]/user", {
        body: { name: "John Doe" },
      })
      .query();

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: "/user",
      method: "POST",
      data: { name: "John Doe" },
    });
    expect(user).toMatchObject({ name: "John Doe" });
  });
});
