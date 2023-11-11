import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  Args,
  createRouteDefinition,
  OkResponse,
  createRouteUri,
  query,
} from "./clientFactory";
import { RouteDefinition, Schema } from "./types";
import { TypeProvider } from "./Provider";

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

export type Client<
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider
> = {
  ref: <URL extends keyof Definitions & string>(
    url: URL
  ) => Ref<Definitions, URL, TP>;
  infer: {
    [URL in keyof Definitions & string]: OkResponse<Definitions[URL], TP>;
  };
  inferArgs: {
    [URL in keyof Definitions & string]: Args<Definitions[URL]["schema"], TP>;
  };
};

export type Ref<
  Definitions extends Record<string, RouteDefinition>,
  URL extends keyof Definitions & string,
  TP extends TypeProvider
> = {
  url: (
    args: Args<Definitions[URL]["schema"], TP>,
    config?: AxiosRequestConfig
  ) => string;
  query: (
    args: Args<Definitions[URL]["schema"], TP>,
    config?: AxiosRequestConfig
  ) => Promise<OkResponse<Definitions[URL], TP>>;
};

export const createClient = <
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider
>({
  instance,
}: {
  instance: AxiosInstance;
}) => {
  return {
    route: <URL extends keyof Definitions & string>(
      url: URL,
      args: Args<Definitions[URL]["schema"], TP>,
      config?: AxiosRequestConfig
    ) => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return {
        url: createRouteUri<Definitions[URL], TP>({
          url: shortUrl,
          method,
          instance,
          args,
          config,
        }),
        query: () => {
          return query<Definitions[URL], TP>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          });
        },
      };
    },
    ref: <URL extends keyof Definitions & string>(
      url: URL
    ): Ref<Definitions, URL, TP> => {
      const method = url.split("]")[0].replace("[", "");
      const shortUrl = url.split("]").slice(1).join("]");
      return {
        url: (
          args: Args<Definitions[URL]["schema"], TP>,
          config?: AxiosRequestConfig
        ) =>
          createRouteUri<Definitions[URL], TP>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          }),
        query: (
          args: Args<Definitions[URL]["schema"], TP>,
          config?: AxiosRequestConfig
        ) => {
          return query<Definitions[URL], TP>({
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
      [URL in keyof Definitions & string]: OkResponse<Definitions[URL], TP>;
    },
    inferArgs: undefined as unknown as {
      [URL in keyof Definitions & string]: Args<Definitions[URL]["schema"], TP>;
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
