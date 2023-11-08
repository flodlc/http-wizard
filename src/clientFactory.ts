import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ArgsFromTB,
  ResponseFromSchemaTypeBox,
  SchemaTypeBox,
} from "./TypeboxAdapter";
import { ArgsFromZod, ResponseFromSchemaZod, SchemaZod } from "./ZodAdapter";
import { RouteDefinition, Simplify, Schema, DrainOuterGeneric } from "./types";

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

const processUrl = (url: string, args: object) =>
  Object.entries(("params" in args ? args?.params : undefined) ?? {}).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), value as string),
    url
  );

export const createRouteUri = <D extends RouteDefinition>({
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
}): string => {
  return instance.getUri({
    method,
    url: processUrl(url, args),
    params: args?.query,
    data: args?.body,
    ...config,
    ...args,
  });
};

export const query = async <D extends RouteDefinition>({
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
}): Promise<OkResponse<D>> => {
  const { data } = await instance.request({
    method,
    url: processUrl(url, args),
    ...config,
    params: "query" in args ? args.query : undefined,
    data: "body" in args ? args.body : undefined,
  });

  return data;
};

export type OkResponse<D extends RouteDefinition> = Simplify<
  DrainOuterGeneric<
    Response<D["schema"], D["okCode"] extends number ? D["okCode"] : 200>
  >
>;

export const createRouteDefinition = <const R extends RouteDefinition>(
  routeDefinition: R
) => routeDefinition;
