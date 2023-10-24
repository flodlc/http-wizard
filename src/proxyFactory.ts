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

  const url = name.replace(method.toLowerCase(), "").toLowerCase();
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
      get: (_, prop: string) => {
        const method = prop.startsWith("post")
          ? "POST"
          : prop.startsWith("get")
          ? "GET"
          : undefined;
        if (!method) throw "wrong method";

        const url = prop.replace(method.toLowerCase(), "").toLowerCase();

        return createClientMethod({ method, url, instance });
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
