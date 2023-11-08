import { z } from "zod";

export type ArgsFromZod<S extends SchemaZod> = BodyFromSchemaZod<S> &
  QueryFromSchemaZod<S> &
  ParamsFromSchemaZod<S>;

export type SchemaZod = {
  params?: z.AnyZodObject;
  querystring?: z.AnyZodObject;
  body?: z.Schema;
  response: Record<number, z.Schema>;
};
export type ParamsFromSchemaZod<S extends SchemaZod> = S extends {
  params: z.AnyZodObject;
}
  ? { params: z.infer<S["params"]> }
  : { params?: never };

export type QueryFromSchemaZod<S extends SchemaZod> = S extends {
  querystring: z.AnyZodObject;
}
  ? { query: z.infer<S["querystring"]> }
  : { query?: never };

export type BodyFromSchemaZod<S extends SchemaZod> = S extends {
  body: z.Schema;
}
  ? { body: z.infer<S["body"]> }
  : { body?: never };

export type ResponseFromSchemaZod<
  S extends SchemaZod,
  OK extends number = 200
> = S extends {
  response: { [C in OK]: z.Schema };
}
  ? z.infer<S["response"][OK]>
  : undefined;
