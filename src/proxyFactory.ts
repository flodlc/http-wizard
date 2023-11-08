import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  Args,
  createRouteDefinition,
  OkResponse,
  createRouteUri,
  createClientQuery,
} from "./clientFactory";
import { RouteDefinition, Schema } from "./types";

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
  Definitions extends {
    [K in keyof Definitions]: RouteDefinition;
  }
>({
  instance,
}: {
  instance: AxiosInstance;
}) => {
  return {
    query: <URL extends keyof Definitions>(
      url: string,
      args: Args<Definitions[URL]["schema"]>,
      config: AxiosRequestConfig
    ) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return createClientQuery({
        url: shortUrl,
        method,
        instance,
        args,
        config,
      });
    },
    url: <URL extends keyof Definitions>(
      url: string,
      args: Args<Definitions[URL]["schema"]>,
      config: AxiosRequestConfig
    ) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return createRouteUri({
        url: shortUrl,
        method,
        instance,
        args,
        config,
      });
    },
    infer: undefined as unknown,
  } as {
    url: <URL extends keyof Definitions, R = Definitions[URL]>(
      url: URL,
      args: R extends RouteDefinition ? Args<R["schema"]> : never,
      config?: AxiosRequestConfig
    ) => string;
    query: <URL extends keyof Definitions, R = Definitions[URL]>(
      url: URL,
      args: R extends RouteDefinition ? Args<R["schema"]> : never,
      config?: AxiosRequestConfig
    ) => R extends RouteDefinition ? Promise<OkResponse<R>> : never;
    infer: { [URL in keyof Definitions]: OkResponse<Definitions[URL]> };
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

export const createRouter = <
  const Definitions extends {
    [K in keyof Definitions]: RouteDefinition;
  }
>(
  routes: Definitions
): Definitions => {
  return routes;
};
