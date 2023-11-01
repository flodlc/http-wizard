import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  BodyFromSchemaTypeBox,
  ParamsFromSchemaTypeBox,
  QueryFromSchemaTypeBox,
  ResponseFromSchemaTypeBox,
  SchemaTypeBox,
} from "./TypeboxAdapter";
import {
  BodyFromSchemaZod,
  ParamsFromSchemaZod,
  QueryFromSchemaZod,
  ResponseFromSchemaZod,
  SchemaZod,
} from "./ZodAdapter";
import { RouteDefinition, Simplify, Schema } from "./types";

type ArgsFromTB<S extends SchemaTypeBox> =
  (BodyFromSchemaTypeBox<S> extends undefined
    ? { body?: undefined }
    : { body: BodyFromSchemaTypeBox<S> }) &
    (QueryFromSchemaTypeBox<S> extends undefined
      ? { query?: undefined }
      : { query: QueryFromSchemaTypeBox<S> }) &
    (ParamsFromSchemaTypeBox<S> extends undefined
      ? { params?: undefined }
      : { params: ParamsFromSchemaTypeBox<S> });

type Empty<O extends Object> = O[keyof O] extends undefined | never
  ? true
  : false;

type NeverIfEmpty<O extends Object> = Empty<O> extends true ? {} : O;

type ArgsFromZod<S extends SchemaZod> = (BodyFromSchemaZod<S> extends undefined
  ? { body?: never }
  : { body: BodyFromSchemaZod<S> }) &
  (QueryFromSchemaZod<S> extends undefined
    ? { query?: never }
    : { query: QueryFromSchemaZod<S> }) &
  (ParamsFromSchemaZod<S> extends undefined
    ? { params?: never }
    : { params: ParamsFromSchemaZod<S> });

export type Args<S extends Schema> = S extends SchemaTypeBox
  ? ArgsFromTB<S>
  : S extends SchemaZod
  ? ArgsFromZod<S>
  : any;

export type Response<
  S extends Schema,
  OK extends number = 200
> = S extends SchemaTypeBox
  ? ResponseFromSchemaTypeBox<S, OK>
  : S extends SchemaZod
  ? ResponseFromSchemaZod<S, OK>
  : unknown;

export const callApi = async <S extends Schema>({
  config,
  method,
  url,
  instance,
  ...props
}: {
  method: AxiosRequestConfig["method"];
  url: string;
  config?: AxiosRequestConfig;
  instance: AxiosInstance;
} & Args<S>) => {
  const { data } = await instance.request({
    method,
    url,
    ...config,
    params: "query" in props ? props.query : undefined,
    data: "body" in props ? props.body : undefined,
  });
  return data as Response<S>;
};

export const createClientMethod = <S extends Schema>({
  method,
  url,
  instance,
  args,
  config,
}: {
  method: AxiosRequestConfig["method"];
  url: string;
  instance: AxiosInstance;
  args: Args<S>;
  config?: AxiosRequestConfig;
}) => {
  const processedUrl = Object.entries(
    ("params" in args ? args?.params : undefined) ?? {}
  ).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), value as string),
    url
  );
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
      params: args?.query,
      data: args?.body,
      ...config,
      ...args,
    }),
  };
};

export type OkResponse<D extends RouteDefinition> = Simplify<
  Response<D["schema"], D["okCode"] extends number ? D["okCode"] : 200>
>;

export type RouteClient<D extends RouteDefinition> = {
  call: () => Promise<OkResponse<D>>;
  url: string;
};

export const createRouteDefinition = <const R extends RouteDefinition>(
  routeDefinition: R
) => routeDefinition;
