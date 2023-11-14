import { z, ZodType } from 'zod';

import { TypeProvider } from './Provider';

``;
export type SchemaZod = {
  params?: z.AnyZodObject;
  querystring?: z.AnyZodObject;
  body?: z.Schema;
  response: Record<number, z.Schema>;
};

export interface ZodTypeProvider extends TypeProvider {
  output: this['input'] extends ZodType ? z.infer<this['input']> : never;
}
