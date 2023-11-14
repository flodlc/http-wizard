import { Static, TSchema } from '@sinclair/typebox';

import { TypeProvider } from './Provider';

export type SchemaTypeBox = {
  params?: TSchema;
  querystring?: TSchema;
  body?: TSchema;
  response: Record<number, TSchema>;
};

export interface TypeBoxTypeProvider extends TypeProvider {
  output: this['input'] extends TSchema ? Static<this['input']> : never;
}
