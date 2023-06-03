import { Type } from '@sinclair/typebox';
import { loadRouteDefinitions } from './clientFactory';

const definitions = {
  getUsers: {
    method: 'GET',
    url: '/users',
    schema: {
      querystring: Type.Object({
        offset: Type.Optional(Type.Number()),
        limit: Type.Optional(Type.Number()),
      }),
      response: {
        200: Type.Array(
          Type.Object({
            name: Type.String(),
            age: Type.Number(),
          })
        ),
      },
    },
  },
} as const;

const { createClient, schema } = loadRouteDefinitions(definitions);
const client = createClient({} as any);

async () => {
  const users = await client.getUsers({ query: { limit: 1 } });
};
