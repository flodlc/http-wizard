import {
  Args,
  Client,
  createClient,
  OkResponse,
  Ref,
  RouteDefinition,
  TypeProvider,
} from '@http-wizard/core';
import {
  FetchQueryOptions,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';

export type ClientWithReactQuery<
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider,
> = Omit<Client<Definitions, TP>, 'ref'> & {
  ref: <URL extends keyof Definitions & string>(
    url: URL
  ) => Ref<Definitions, URL, TP> & {
    useQuery: (
      args: Args<Definitions[URL]['schema'], TP>,
      options?: Omit<
        UseQueryOptions<
          OkResponse<Definitions[URL], TP>,
          Error,
          OkResponse<Definitions[URL], TP>,
          QueryKey
        >,
        'queryKey' | 'queryFn'
      >,
      config?: AxiosRequestConfig
    ) => UseQueryResult<OkResponse<Definitions[URL], TP>>;
    useInfiniteQuery: (
      args: Args<Definitions[URL]['schema'], TP>,
      options: Omit<
        UseInfiniteQueryOptions<OkResponse<Definitions[URL], TP>>,
        'queryKey' | 'queryFn'
      >,
      config?: AxiosRequestConfig
    ) => UseInfiniteQueryResult<OkResponse<Definitions[URL], TP>>;
    useMutation: (
      options?: UseMutationOptions<
        OkResponse<Definitions[URL], TP>,
        Error,
        Args<Definitions[URL]['schema'], TP>
      >,
      config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
    ) => UseMutationResult<
      OkResponse<Definitions[URL], TP>,
      Error,
      Args<Definitions[URL]['schema'], TP>
    >;
    prefetchQuery: (
      args: Args<Definitions[URL]['schema'], TP>,
      options?: Omit<
        FetchQueryOptions<OkResponse<Definitions[URL], TP>>,
        'queryKey' | 'queryFn'
      >,
      config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
    ) => Promise<void>;
  };
};

export const createQueryClient = <
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider,
>({
  queryClient: optionQueryClient,
  ...options
}: Parameters<typeof createClient>[0] & {
  queryClient?: QueryClient;
}): ClientWithReactQuery<Definitions, TP> => {
  const client: Client<Definitions, TP> = createClient<Definitions, TP>(
    options
  );
  return {
    ...client,
    ref: <URL extends keyof Definitions & string>(url: URL) => {
      const routeRef = client.ref<URL>(url);
      return {
        useQuery: (
          args: Args<Definitions[URL]['schema'], TP>,
          options?: Omit<
            UseQueryOptions<
              OkResponse<Definitions[URL], TP>,
              Error,
              OkResponse<Definitions[URL], TP>,
              QueryKey
            >,
            'queryKey' | 'queryFn'
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
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
          args: Args<Definitions[URL]['schema'], TP>,
          options: Omit<
            UseInfiniteQueryOptions<OkResponse<Definitions[URL], TP>>,
            'queryKey' | 'queryFn'
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
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
            Args<Definitions[URL]['schema'], TP>
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
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
          args: Args<Definitions[URL]['schema'], TP>,
          options?: Omit<
            FetchQueryOptions<OkResponse<Definitions[URL], TP>>,
            'queryKey' | 'queryFn'
          >,
          config?: Parameters<Ref<Definitions, URL, TP>['query']>[1]
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

createQueryClient({ instance: axios.create() });
