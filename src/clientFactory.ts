import { Static, TSchema } from '@sinclair/typebox';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

type Schema = {
  params?: TSchema;
  querystring?: TSchema;
  body?: TSchema;
  response: Record<number, TSchema>;
};

export type ParamsFromSchema<S> = S extends {
  params: TSchema;
}
  ? Static<S['params']>
  : undefined;

export type Params<S extends Schema> = ParamsFromSchema<S>;

export type QueryFromSchema<S> = S extends {
  querystring: TSchema;
}
  ? Static<S['querystring']>
  : undefined;
export type Query<S extends Schema> = QueryFromSchema<S>;

export type BodyFromSchema<S> = S extends {
  body: TSchema;
}
  ? Static<S['body']>
  : undefined;

export type Body<S extends Schema> = BodyFromSchema<S>;

export type Args<S extends Schema> = Record<string, unknown> &
  (Body<S> extends undefined ? { body?: undefined } : { body: Body<S> }) &
  (Query<S> extends undefined ? { query?: undefined } : { query: Query<S> }) &
  (Params<S> extends undefined
    ? { params?: undefined }
    : { params: Params<S> });

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
    url: string;
    instance: AxiosInstance;
  }) =>
  (args: Args<S>, config?: AxiosRequestConfig) => {
    return {
      call: () =>
        callApi<S>({
          method,
          url,
          config,
          instance,
          ...args,
        }),
      url: instance.getUri({
        method,
        url,
        params: args.query,
        data: args.body,
        ...config,
      }),
    };
  };

type Simplify<T> = { [K in keyof T]: T[K] } & {};

export const loadRouteDefinitions = <
  D extends Record<
    string,
    {
      method: AxiosRequestConfig['method'];
      url: string;
      schema: any;
    }
  >
>(
  definitions: D
) => {
  return [
    (instance: AxiosInstance) => {
      const schema = definitions['getFiltersForCadran'].schema;
      return Object.fromEntries(
        Object.entries(definitions).map(([key, def]) => {
          return [key, createClientMethod<typeof schema>({ ...def, instance })];
        })
      );
    },
    definitions['getFiltersForCadran'].schema,
  ] as unknown as {
    createClient: (instance: any) => {
      [K in keyof typeof definitions]: (
        args: Simplify<Args<D[K]['schema']>>
      ) => Promise<Simplify<Response<D[K]['schema']>>>;
    };
    schema: { [K in keyof D]: D[K]['schema'] };
  };
};
