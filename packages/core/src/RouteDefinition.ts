import { AxiosRequestConfig } from 'axios';

import { SchemaTypeBox } from './providers/TypeboxProvider';
import { SchemaZod } from './providers/ZodProvider';

export type Schema = SchemaTypeBox | SchemaZod;

export type RouteDefinition = {
  method: AxiosRequestConfig['method'];
  url: string | (({ params }: { params: { [s: string]: string } }) => string);
  okCode?: number;
  schema: Schema;
};
