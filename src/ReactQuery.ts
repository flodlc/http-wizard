import { createClient, createRoute } from "./proxyFactory";
import { RouteDefinition } from "./types";
import { useQuery } from "@tanstack/react-query";
import { Type } from "@sinclair/typebox";

export const createQueryClient = <
  Definitions extends {
    [K in keyof Definitions]: RouteDefinition;
  }
>(
  options: Parameters<typeof createClient>[0]
) => {
  const client = createClient<Definitions>(options);
  return {
    useQuery: <URL extends keyof Definitions & string>(
      url: URL,
      args: Parameters<typeof client.query<URL>>[1],
      config?: Parameters<typeof client.query<URL>>[2]
    ) => {
      return useQuery({
        queryKey: [url, args],
        queryFn: () => client.query(url, args as any, config),
      });
    },
  };
};

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
    querystring: Type.Array(Type.Object({ size: Type.String() })),
    response: {
      200: Type.String(),
    },
  },
}).handle(() => {});

const router = {
  ...getToken,
  ...getUser,
  ...getEasy,
};

const cl = createQueryClient<typeof router>({} as any);

const { data } = cl.useQuery("[GET]/token", { query: [{ size: "2" }] });
