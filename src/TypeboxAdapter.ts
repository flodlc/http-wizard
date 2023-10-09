import { Static, TSchema } from "@sinclair/typebox";
import { Schema } from "zod";

export type SchemaTypeBox = {
  params?: TSchema;
  querystring?: TSchema;
  body?: TSchema;
  response: Record<number, TSchema>;
};

export type ParamsFromSchemaTypeBox<S extends SchemaTypeBox> = S extends {
  params: TSchema;
}
  ? Static<S["params"]>
  : undefined;

export type QueryFromSchemaTypeBox<S extends SchemaTypeBox> = S extends {
  querystring: TSchema;
}
  ? Static<S["querystring"]>
  : undefined;

export type BodyFromSchemaTypeBox<S extends SchemaTypeBox> = S extends {
  body: TSchema;
}
  ? Static<S["body"]>
  : undefined;

export type ResponseFromSchemaTypeBox<S extends SchemaTypeBox> = S extends {
  response: { 200: TSchema };
}
  ? Static<S["response"][200]>
  : undefined;
