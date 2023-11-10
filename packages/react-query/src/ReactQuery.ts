import { RouteDefinition, createClient, createRoute } from "http-wizard";
import {
  FetchQueryOptions,
  QueryClient,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const createQueryClient = <
  Definitions extends Record<string, RouteDefinition>
>({
  queryClient: optionQueryClient,
  ...options
}: Parameters<typeof createClient>[0] & { queryClient?: QueryClient }) => {
  const client = createClient<Definitions>(options);
  return {
    ...client,
    ref: <URL extends keyof Definitions & string>(url: URL) => {
      const routeRef = client.ref<URL>(url);
      return {
        useQuery: (
          args: (typeof client.inferArgs)[URL],
          options?: Omit<
            UseQueryOptions<(typeof client.infer)[typeof url]>,
            "queryKey" | "queryFn"
          >,
          config?: Parameters<ReturnType<typeof client.ref<URL>>["query"]>[1]
        ) =>
          useQuery(
            {
              queryKey: [url, args],
              queryFn: () => client.ref<URL>(url).query(args, config),
              ...options,
            },
            optionQueryClient
          ),
        useInfiniteQuery: (
          args: (typeof client.inferArgs)[URL],
          options: Omit<
            UseInfiniteQueryOptions<(typeof client.infer)[typeof url]>,
            "queryKey" | "queryFn"
          >,
          config?: Parameters<ReturnType<typeof client.ref<URL>>["query"]>[1]
        ) =>
          useInfiniteQuery(
            {
              queryKey: [url, args],
              queryFn: () => client.ref<URL>(url).query(args, config),
              ...options,
            },
            optionQueryClient
          ),
        useMutation: (
          options?: UseMutationOptions<
            (typeof client.infer)[typeof url],
            Error,
            (typeof client.inferArgs)[URL]
          >,
          config?: Parameters<ReturnType<typeof client.ref<URL>>["query"]>[1]
        ) =>
          useMutation(
            {
              mutationKey: [url],
              mutationFn: (args) => client.ref<URL>(url).query(args, config),
              ...options,
            },
            optionQueryClient
          ),
        prefetchQuery: (
          args: (typeof client.inferArgs)[URL],
          options?: Omit<
            FetchQueryOptions<(typeof client.infer)[typeof url]>,
            "queryKey" | "queryFn"
          >,
          config?: Parameters<ReturnType<typeof client.ref<URL>>["query"]>[1]
        ) => {
          const queryClient = optionQueryClient ?? useQueryClient();
          return queryClient.prefetchQuery({
            queryKey: [url, args],
            queryFn: () => client.ref<URL>(url).query(args, config),
            ...options,
          });
        },
        ...routeRef,
      };
    },
  };
};
