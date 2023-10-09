import { z } from "zod";

export type SchemaZod = {
  params?: z.AnyZodObject;
  querystring?: z.AnyZodObject;
  body?: z.Schema;
  response: Record<number, z.Schema>;
};
export type ParamsFromSchemaZod<S extends SchemaZod> = S extends {
  params: z.AnyZodObject;
}
  ? z.infer<S["params"]>
  : undefined;

export type QueryFromSchemaZod<S extends SchemaZod> = S extends {
  querystring: z.AnyZodObject;
}
  ? z.infer<S["querystring"]>
  : undefined;

export type BodyFromSchemaZod<S extends SchemaZod> = S extends {
  body: z.Schema;
}
  ? z.infer<S["body"]>
  : undefined;

export type ResponseFromSchemaZod<S extends SchemaZod> = S extends {
  response: { 200: z.AnyZodObject };
}
  ? z.infer<S["response"][200]>
  : undefined;
