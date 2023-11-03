import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ArgsFromTB,
  ResponseFromSchemaTypeBox,
  SchemaTypeBox,
} from "./TypeboxAdapter";
import { ArgsFromZod, ResponseFromSchemaZod, SchemaZod } from "./ZodAdapter";
import { RouteDefinition, Simplify, Schema } from "./types";

type Empty<O extends Object> = O[keyof O] extends undefined | never
  ? true
  : false;

type NeverIfEmpty<O extends Object> = Empty<O> extends true ? {} : O;

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

export const callApi = async <D extends RouteDefinition>({
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
} & Args<D["schema"]>) => {
  const { data } = await instance.request({
    method,
    url,
    ...config,
    params: "query" in props ? props.query : undefined,
    data: "body" in props ? props.body : undefined,
  });
  return data as OkResponse<D>;
};

export const createClientMethod = <D extends RouteDefinition>({
  method,
  url,
  instance,
  args,
  config,
}: {
  method: AxiosRequestConfig["method"];
  url: string;
  instance: AxiosInstance;
  args: Args<D["schema"]>;
  config?: AxiosRequestConfig;
}): RouteClient<D> => {
  const processedUrl = Object.entries(
    ("params" in args ? args?.params : undefined) ?? {}
  ).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), value as string),
    url
  );
  return {
    query: () =>
      callApi<D>({
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
  query: () => Promise<OkResponse<D>>;
  url: string;
};

export const createRouteDefinition = <const R extends RouteDefinition>(
  routeDefinition: R
) => routeDefinition;

export type InferResponse<
  CALL extends (...args: any) => { query: () => Promise<any> }
> = Awaited<ReturnType<ReturnType<CALL>["query"]>>;
