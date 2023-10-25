import { AxiosInstance } from "axios";
import {
  RouteClient,
  createClientMethod,
  createRouteDefinition,
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

const parseRouteName = (name: string) => {
  const method = methods.find((item) =>
    name.startsWith(item.toLocaleLowerCase())
  );

  if (!method) throw "wrong method";

  const url = name
    .replace(method.toLowerCase(), "")
    .replace(/[A-Z]/g, (letter) => `/${letter.toLowerCase()}`);
  return { method, url } as const;
};

export const createClient = <
  Definitions extends {
    [K in keyof Definitions]: RouteDefinition;
  }
>({
  instance,
}: {
  instance: AxiosInstance;
}): {
  [K in keyof Definitions]: RouteClient<Definitions[K]>;
} => {
  return new Proxy(
    {},
    {
      get: (_, name: string) => {
        const parsed = parseRouteName(name);
        return createClientMethod({ ...parsed, instance });
      },
    }
  ) as {
    [K in keyof Definitions]: RouteClient<Definitions[K]>;
  };
};

export const createRoute = <N extends string, S extends Schema>(
  name: N,
  schema: S
) => {
  return {
    handle: (
      callback: (args: {
        method: (typeof methods)[number];
        url: string;
        schema: S;
      }) => void
    ) => {
      const parsed = parseRouteName(name);
      callback({ ...parsed, schema });
      const routeDef = createRouteDefinition({ ...parsed, schema });
      return { [name]: routeDef } as { [k in N]: typeof routeDef };
    },
  };
};
