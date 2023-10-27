import { Type } from "@sinclair/typebox";
import { createRoute } from "./proxyFactory";
import { z } from "zod";

export const getUser = (instance: any) =>
  createRoute("getUser", {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.array(
          z.object({
            name: z.string(),
            age: z.number(),
          })
        ),
      },
    },
  }).handle(({ method, url, schema }) => {
    instance.route({ method, url, schema, handler: () => {} });
  });
