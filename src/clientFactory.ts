import { Static, TSchema } from "@sinclair/typebox";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { z } from "zod";
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

type Schema = SchemaTypeBox | SchemaZod;

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

type ArgsFromZod<S extends SchemaZod> = (BodyFromSchemaZod<S> extends undefined
  ? { body?: undefined }
  : { body: BodyFromSchemaZod<S> }) &
  (QueryFromSchemaZod<S> extends undefined
    ? { query?: undefined }
    : { query: QueryFromSchemaZod<S> }) &
  (ParamsFromSchemaZod<S> extends undefined
    ? { params?: undefined }
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
    method: AxiosRequestConfig["method"];
    url: string | (({ params }: { params: Args<S>["params"] }) => string);
    instance: AxiosInstance;
  }) =>
  (args: Args<S>, config?: AxiosRequestConfig) => {
    const processedUrl =
      typeof url === "string"
        ? Object.entries(args.params ?? {}).reduce((acc, [key, value]) => {
            const sdf = new RegExp(`:${key}`, "g");
            return acc.replace(sdf, value as string);
          }, url)
        : url({ params: args.params as Args<S>["params"] });
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

type RouteDefinition = {
  method: AxiosRequestConfig["method"];
  url: string | (({ params }: { params: { [s: string]: string } }) => string);
  okCode?: number;
  schema: Schema;
};

export const createRouteDefinition = <const R extends RouteDefinition>(
  routeDefinition: R
) => routeDefinition;

export const loadRouteDefinitions = <
  const D extends {
    [K in keyof D]: RouteDefinition;
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
        args: Simplify<Args<D[K]["schema"]>>,
        config?: AxiosRequestConfig
      ) => {
        call: () => Promise<
          Simplify<
            Response<
              D[K]["schema"],
              D[K]["okCode"] extends number ? D[K]["okCode"] : 200
            >
          >
        >;
        url: string;
      };
    },
    { [K in keyof D]: D[K]["schema"] }
  ];
};
