import { createClient, createRoute } from "./proxyFactory";
import { RouteDefinition } from "./types";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Type } from "@sinclair/typebox";

export const createQueryClient = <
  Definitions extends Record<string, RouteDefinition>
>(
  options: Parameters<typeof createClient>[0]
) => {
  const client = createClient<Definitions>(options);
  return {
    ...client,
    route: <URL extends keyof Definitions & string>(
      url: URL,
      args: Parameters<typeof client.route<URL>>[1],
      config?: Parameters<typeof client.route<URL>>[2]
    ) => {
      const routeInstance = client.route<URL>(url, args, config);
      return {
        ...routeInstance,
        useQuery: (
          options?: Omit<
            UseQueryOptions<(typeof client.infer)[typeof url]>,
            "queryKey" | "queryFn"
          >
        ) =>
          useQuery({
            queryKey: [url, args],
            queryFn: client.route<URL>(url, args, config).query,
          }),
        useMutation: () =>
          useMutation({
            mutationKey: [url, args],
            mutationFn: client.route<URL>(url, args, config).query,
          }),
        prefetchQuery: () => {
          const queryClient = useQueryClient();
          queryClient.prefetchQuery({
            queryKey: [url, args],
            queryFn: client.route<URL>(url, args, config).query,
          });
        },
      };
    },
  };
};
