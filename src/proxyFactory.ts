import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  Args,
  createRouteDefinition,
  OkResponse,
  createRouteUri,
  query,
} from "./clientFactory";
import { DrainOuterGeneric, RouteDefinition, Schema } from "./types";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { Type } from "@sinclair/typebox";

const methods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "HEAD",
  "PATCH",
  "OPTIONS",
  "COPY",
  "MOVE",
  "SEARCH",
] as const;

export const createClient = <
  Definitions extends Record<string, RouteDefinition>
>({
  instance,
}: {
  instance: AxiosInstance;
}) => {
  return {
    url: <URL extends keyof Definitions & string, R = Definitions[URL]>(
      url: URL,
      args: R extends RouteDefinition
        ? Args<DrainOuterGeneric<R["schema"]>>
        : never,
      config?: AxiosRequestConfig
    ) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return createRouteUri<Definitions[URL]>({
        url: shortUrl,
        method,
        instance,
        args,
        config,
      });
    },
    query: <URL extends keyof Definitions & string>(
      url: URL,
      args: Args<DrainOuterGeneric<Definitions[URL]["schema"]>>,
      config?: AxiosRequestConfig
    ) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return query<Definitions[URL]>({
        url: shortUrl,
        method,
        instance,
        args,
        config,
      });
    },
    infer: undefined as unknown as {
      [URL in keyof Definitions]: OkResponse<Definitions[URL]>;
    },
  };
};

export const createRoute = <
  const URL extends string,
  const D extends {
    schema: Schema;
    okCode?: number;
    method: (typeof methods)[number];
  }
>(
  url: URL,
  options: D
) => {
  return {
    handle: (
      callback: (args: {
        method: (typeof methods)[number];
        url: URL;
        schema: D["schema"];
      }) => void
    ) => {
      callback({
        url,
        method: options.method,
        schema: options.schema,
      });
      const routeDef = createRouteDefinition({
        url,
        ...options,
      });
      const key = `${options.method}/${url}` as `${D["method"]}${URL}`;
      return { [key]: routeDef } as {
        [k in `[${D["method"]}]${URL}`]: typeof routeDef;
      };
    },
  };
};
