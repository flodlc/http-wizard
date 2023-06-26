import { Type } from '@sinclair/typebox';
import { Definitions, loadRouteDefinitions } from './clientFactory';

const { createClient, schema } = loadRouteDefinitions({
  getUsers: {
    method: 'GET',
    url: (ddsf) => '/users',
    schema: {
      params: Type.Object({ toto: Type.String() }),
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
} as const);

const client = createClient({} as any);

async () => {
  const users = await client.getUsers({
    query: { limit: 1 },
    params: { toto: 'a' },
  });
};
