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
