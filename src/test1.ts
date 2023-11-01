import { Type } from "@sinclair/typebox";
import { createRoute } from "./proxyFactory";
import { z } from "zod";

export const getUser = (instance: any) =>
  createRoute("/user", {
    method: "GET",
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

export const getRandomUser = (instance: any) =>
  createRoute("/user/rd", {
    method: "GET",
    schema: {
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

export const postPet = (instance: any) =>
  createRoute("/pet", {
    method: "POST",
    schema: {
      params: z.object({
        idff: z.string(),
      }),
      response: {
        200: z.array(
          z.object({
            namesdf: z.string(),
            agesfd: z.number(),
          })
        ),
      },
    },
  }).handle(({ method, url, schema }) => {
    instance.route({ method, url, schema, handler: () => {} });
  });
