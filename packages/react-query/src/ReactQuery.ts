import {
  Args,
  Client,
  OkResponse,
  Ref,
  RouteDefinition,
  TypeProvider,
  createClient,
} from "http-wizard";
import {
  FetchQueryOptions,
  QueryClient,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const createQueryClient = <
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider
>({
  queryClient: optionQueryClient,
  ...options
}: Parameters<typeof createClient>[0] & {
  queryClient?: QueryClient;
}): Omit<Client<Definitions, TP>, "ref"> & {
  ref: <URL extends keyof Definitions & string>(
    url: URL
  ) => Ref<Definitions, URL, TP> & {
    useQuery: (
      args: Args<Definitions[URL]["schema"], TP>,
      options?: Omit<
        UseQueryOptions<OkResponse<Definitions[URL], TP>>,
        "queryKey" | "queryFn"
      >,
      config?: AxiosRequestConfig
    ) => UseQueryResult<OkResponse<Definitions[URL], TP>>;
    useInfiniteQuery: (
      args: Args<Definitions[URL]["schema"], TP>,
      options: Omit<
        UseInfiniteQueryOptions<OkResponse<Definitions[URL], TP>>,
        "queryKey" | "queryFn"
      >,
      config?: AxiosRequestConfig
    ) => UseInfiniteQueryResult<OkResponse<Definitions[URL], TP>>;
    useMutation: (
      options?: UseMutationOptions<
        OkResponse<Definitions[URL], TP>,
        Error,
        Args<Definitions[URL]["schema"], TP>
      >,
      config?: Parameters<Ref<Definitions, URL, TP>["query"]>[1]
    ) => UseMutationResult<
      OkResponse<Definitions[URL], TP>,
      Error,
      Args<Definitions[URL]["schema"], TP>
    >;
    prefetchQuery: (
      args: Args<Definitions[URL]["schema"], TP>,
      options?: Omit<
        FetchQueryOptions<OkResponse<Definitions[URL], TP>>,
        "queryKey" | "queryFn"
      >,
      config?: Parameters<Ref<Definitions, URL, TP>["query"]>[1]
    ) => Promise<void>;
  };
} => {
  const client: Client<Definitions, TP> = createClient<Definitions, TP>(
    options
  );
  return {
    ...client,
    ref: <URL extends keyof Definitions & string>(url: URL) => {
      const routeRef = client.ref<URL>(url);
      return {
        useQuery: (
          args: Args<Definitions[URL]["schema"], TP>,
          options?: Omit<
            UseQueryOptions<OkResponse<Definitions[URL], TP>>,
            "queryKey" | "queryFn"
          >,
          config?: Parameters<Ref<Definitions, URL, TP>["query"]>[1]
        ) =>
          useQuery(
            {
              queryKey: [url, args],
              queryFn: () => routeRef.query(args, config),
              ...options,
            },
            optionQueryClient
          ),
        useInfiniteQuery: (
          args: Args<Definitions[URL]["schema"], TP>,
          options: Omit<
            UseInfiniteQueryOptions<OkResponse<Definitions[URL], TP>>,
            "queryKey" | "queryFn"
          >,
          config?: Parameters<Ref<Definitions, URL, TP>["query"]>[1]
        ) =>
          useInfiniteQuery(
            {
              queryKey: [url, args],
              queryFn: () => routeRef.query(args, config),
              ...options,
            },
            optionQueryClient
          ),
        useMutation: (
          options?: UseMutationOptions<
            OkResponse<Definitions[URL], TP>,
            Error,
            Args<Definitions[URL]["schema"], TP>
          >,
          config?: Parameters<Ref<Definitions, URL, TP>["query"]>[1]
        ) =>
          useMutation(
            {
              mutationKey: [url],
              mutationFn: (args) => routeRef.query(args, config),
              ...options,
            },
            optionQueryClient
          ),
        prefetchQuery: (
          args: Args<Definitions[URL]["schema"], TP>,
          options?: Omit<
            FetchQueryOptions<OkResponse<Definitions[URL], TP>>,
            "queryKey" | "queryFn"
          >,
          config?: Parameters<Ref<Definitions, URL, TP>["query"]>[1]
        ) => {
          const queryClient = optionQueryClient ?? useQueryClient();
          return queryClient.prefetchQuery({
            queryKey: [url, args],
            queryFn: () => routeRef.query(args, config),
            ...options,
          });
        },
        ...routeRef,
      };
    },
  };
};
