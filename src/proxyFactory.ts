import { AxiosInstance } from "axios";
import {
  RouteClient,
  createClientMethod,
  createRouteDefinition,
} from "./clientFactory";
import { Type } from "@sinclair/typebox";
import { RouteDefinition, Schema } from "./types";

const parseRouteName = (name: string) => {
  const method = name.startsWith("post")
    ? "POST"
    : name.startsWith("get")
    ? "GET"
    : undefined;
  if (!method) throw "wrong method";

  const url = name
    .replace(method.toLowerCase(), "")
    .replace(/[A-Z]/g, (letter) => `/${letter.toLowerCase()}`);
  return { method, url };
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
      callback: (args: { method: string; url: string; schema: S }) => void
    ) => {
      const parsed = parseRouteName(name);
      callback({ ...parsed, schema });
      const routeDef = createRouteDefinition({ ...parsed, schema });
      return { [name]: routeDef } as { [k in N]: typeof routeDef };
    },
  };
};
