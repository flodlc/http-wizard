import { z } from 'zod';

import { RouteDefinition, Schema } from '../RouteDefinition';

const methods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'HEAD',
  'PATCH',
  'OPTIONS',
  'COPY',
  'MOVE',
  'SEARCH',
] as const;

export const createRouteDefinition = <const R extends RouteDefinition>(
  routeDefinition: R
) => routeDefinition;

export const createRoute = <
  const URL extends string,
  const D extends {
    schema: Schema;
    okCode?: number;
    method: (typeof methods)[number];
  },
>(
  url: URL,
  options: D
) => {
  return {
    handle: (
      callback: (args: {
        method: (typeof methods)[number];
        url: URL;
        schema: D['schema'];
      }) => void
    ) => {
      callback({
        url,
        method: options.method,
        schema: options.schema,
      });
      const routeDef = { url, ...options };
      const key = `[${options.method}]${url}` as `${D['method']}${URL}`;
      return { [key]: routeDef } as {
        [k in `[${D['method']}]${URL}`]: typeof routeDef;
      };
    },
  };
};

const a = createRoute('/member/:id', {
  method: 'GET',
  schema: { response: { 200: z.object({}) } },
}).handle(({ method, url, schema }) => {
  // console.log(method, url, schema);
});

console.log('a', a, a['[GET]/member/:id'].url);
