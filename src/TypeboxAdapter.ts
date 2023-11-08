import { Static, TSchema } from "@sinclair/typebox";

export type ArgsFromTB<S extends SchemaTypeBox> =
  (BodyFromSchemaTypeBox<S> extends undefined
    ? { body?: undefined }
    : { body: BodyFromSchemaTypeBox<S> }) &
    (S["querystring"] extends TSchema
      ? { query: Static<S["querystring"]> }
      : { query?: undefined }) &
    (ParamsFromSchemaTypeBox<S> extends undefined
      ? { params?: undefined }
      : { params: ParamsFromSchemaTypeBox<S> });

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

export type QueryFromSchemaTypeBox<S extends TSchema | undefined> =
  S extends TSchema ? { query: Static<S> } : { query?: undefined };

export type BodyFromSchemaTypeBox<S extends SchemaTypeBox> = S extends {
  body: TSchema;
}
  ? Static<S["body"]>
  : undefined;

export type ResponseFromSchemaTypeBox<
  S extends SchemaTypeBox,
  OK extends number = 200
> = S extends {
  response: { [C in OK]: TSchema };
}
  ? Static<S["response"][OK]>
  : undefined;
