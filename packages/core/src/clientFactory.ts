import { AxiosInstance, AxiosRequestConfig } from "axios";
import { RouteDefinition, Schema } from "./types";
import { CallTypeProvider, TypeProvider } from "./Provider";

export type Args<
  S extends Schema,
  TP extends TypeProvider
> = (S["params"] extends object
  ? { params: CallTypeProvider<S["params"], TP> }
  : { params?: undefined }) &
  (S["querystring"] extends object
    ? { query: CallTypeProvider<S["querystring"], TP> }
    : { query?: undefined }) &
  (S["body"] extends object
    ? { body: CallTypeProvider<S["body"], TP> }
    : { body?: undefined });

export type Response<
  S extends Schema,
  OK extends number,
  TP extends TypeProvider
> = CallTypeProvider<S["response"][OK], TP>;

type Empty<O extends Object> = O[keyof O] extends undefined | never
  ? true
  : false;

type NeverIfEmpty<O extends Object> = Empty<O> extends true ? {} : O;

const processUrl = (url: string, args: object) =>
  Object.entries(("params" in args ? args?.params : undefined) ?? {}).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, "g"), value as string),
    url
  );

export const createRouteUri = <
  D extends RouteDefinition,
  TP extends TypeProvider
>({
  method,
  url,
  instance,
  args,
  config,
}: {
  method: AxiosRequestConfig["method"];
  url: string;
  instance: AxiosInstance;
  args: Args<D["schema"], TP>;
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

export const query = async <
  D extends RouteDefinition,
  TP extends TypeProvider
>({
  method,
  url,
  instance,
  args,
  config,
}: {
  method: AxiosRequestConfig["method"];
  url: string;
  instance: AxiosInstance;
  args: Args<D["schema"], TP>;
  config?: AxiosRequestConfig;
}): Promise<OkResponse<D, TP>> => {
  const { data } = await instance.request({
    method,
    url: processUrl(url, args),
    ...config,
    params: "query" in args ? args.query : undefined,
    data: "body" in args ? args.body : undefined,
  });

  return data;
};

export type OkResponse<
  D extends RouteDefinition,
  TP extends TypeProvider
> = Response<D["schema"], D["okCode"] extends number ? D["okCode"] : 200, TP>;

export const createRouteDefinition = <const R extends RouteDefinition>(
  routeDefinition: R
) => routeDefinition;
