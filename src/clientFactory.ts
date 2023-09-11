import { Static, TSchema } from '@sinclair/typebox';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

type Schema = {
  params?: TSchema;
  querystring?: TSchema;
  body?: TSchema;
  response: Record<number, TSchema>;
};

export type ParamsFromSchema<S extends Schema> = S extends {
  params: TSchema;
}
  ? Static<S['params']>
  : undefined;

export type QueryFromSchema<S extends Schema> = S extends {
  querystring: TSchema;
}
  ? Static<S['querystring']>
  : undefined;

export type BodyFromSchema<S extends Schema> = S extends {
  body: TSchema;
}
  ? Static<S['body']>
  : undefined;

export type Args<S extends Schema> = (BodyFromSchema<S> extends undefined
  ? { body?: undefined }
  : { body: BodyFromSchema<S> }) &
  (QueryFromSchema<S> extends undefined
    ? { query?: undefined }
    : { query: QueryFromSchema<S> }) &
  (ParamsFromSchema<S> extends undefined
    ? { params?: undefined }
    : { params: ParamsFromSchema<S> });

export type ResponseFromSchema<S> = S extends {
  response: { 200: TSchema };
}
  ? Static<S['response'][200]>
  : undefined;

export type Response<S extends Schema> = ResponseFromSchema<S>;

export const callApi = async <S extends Schema>({
  config,
  method,
  url,
  instance,
  ...props
}: {
  method: AxiosRequestConfig['method'];
  url: string;
  config?: AxiosRequestConfig;
  instance: AxiosInstance;
} & Args<S>) => {
  const { data } = await instance.request({
    method,
    url,
    ...config,
    params: props.query,
    data: props.body,
  });
  return data as Response<S>;
};

export const createClientMethod =
  <S extends Schema>({
    method,
    url,
    instance,
  }: {
    method: AxiosRequestConfig['method'];
    url: string | (({ params }: { params: Args<S>['params'] }) => string);
    instance: AxiosInstance;
  }) =>
  (args: Args<S>, config?: AxiosRequestConfig) => {
    const processedUrl =
      typeof url === 'string'
        ? Object.entries(args.params ?? {}).reduce((acc, [key, value]) => {
            const sdf = new RegExp(`:${key}`, 'g');
            return acc.replace(sdf, value as string);
          }, url)
        : url({ params: args.params as Args<S>['params'] });
    return {
      call: () =>
        callApi<S>({
          method,
          url: processedUrl,
          config,
          instance,
          ...args,
        }),
      url: instance.getUri({
        method,
        url: processedUrl,
        params: args.query,
        data: args.body,
        ...config,
        ...args,
      }),
    };
  };

type Simplify<T> = { [K in keyof T]: T[K] } & {};

export const createRouteDefinition = <
  R extends {
    method: AxiosRequestConfig['method'];
    url: string | (({ params }: { params: { [s: string]: string } }) => string);
    schema: Schema;
  }
>(
  routeDefinition: R
) => routeDefinition;

export const loadRouteDefinitions = <
  D extends {
    [K in keyof D]: {
      method: AxiosRequestConfig['method'];
      url:
        | string
        | (({ params }: { params: { [s: string]: string } }) => string);
      schema: Schema;
    };
  }
>(
  definitions: D
) => {
  return [
    (instance: AxiosInstance) => {
      return Object.fromEntries(
        Object.entries(definitions).map(([key, def]) => {
          return [key, createClientMethod({ ...(def as any), instance })];
        })
      );
    },
    Object.fromEntries(
      Object.entries(definitions).map(([key, def]) => {
        const schema = (def as any).schema;
        return [key, schema];
      })
    ),
  ] as unknown as [
    (instance: any) => {
      [K in keyof typeof definitions]: (
        args: Simplify<Args<D[K]['schema']>>,
        config?: AxiosRequestConfig
      ) => {
        call: () => Promise<Simplify<Response<D[K]['schema']>>>;
        url: string;
      };
    },
    { [K in keyof D]: D[K]['schema'] }
  ];
};
