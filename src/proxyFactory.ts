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
    route: <URL extends keyof Definitions & string>(
      url: URL,
      args: Args<DrainOuterGeneric<Definitions[URL]["schema"]>>,
      config?: AxiosRequestConfig
    ) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return {
        url: createRouteUri<Definitions[URL]>({
          url: shortUrl,
          method,
          instance,
          args,
          config,
        }),
        query: () => {
          return query<Definitions[URL]>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          });
        },
      };
    },
    ref: <URL extends keyof Definitions & string>(url: URL) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return {
        url: (
          args: Args<DrainOuterGeneric<Definitions[URL]["schema"]>>,
          config?: AxiosRequestConfig
        ) =>
          createRouteUri<Definitions[URL]>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          }),
        query: (
          args: Args<DrainOuterGeneric<Definitions[URL]["schema"]>>,
          config?: AxiosRequestConfig
        ) => {
          return query<Definitions[URL]>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          });
        },
      };
    },
    infer: undefined as unknown as {
      [URL in keyof Definitions]: OkResponse<Definitions[URL]>;
    },
    inferArgs: undefined as unknown as {
      [URL in keyof Definitions]: Args<Definitions[URL]["schema"]>;
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
