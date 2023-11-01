import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  Args,
  createClientMethod,
  createRouteDefinition,
  RouteClient,
  OkResponse,
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
  type DefinitionsByMethod = {
    [M in (typeof methods)[number]]: {
      [V in keyof Definitions as V extends `[${M}]${infer S}`
        ? S
        : never]: Definitions[V];
    };
  };

  return new Proxy(
    {},
    {
      get: (_, method: string) => {
        return (url: string, args: Args<Schema>, config: AxiosRequestConfig) =>
          createClientMethod({
            url,
            method: method.toUpperCase(),
            instance,
            args,
            config,
          });
      },
    }
  ) as {
    [M in keyof DefinitionsByMethod as Lowercase<M>]: <
      URL extends keyof MethodDefinitions,
      MethodDefinitions = DefinitionsByMethod[M],
      R = URL extends keyof MethodDefinitions ? MethodDefinitions[URL] : never
    >(
      url: URL,
      args: R extends RouteDefinition ? Args<R["schema"]> : never,
      config?: AxiosRequestConfig
    ) => R extends RouteDefinition ? RouteClient<R> : never;
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
