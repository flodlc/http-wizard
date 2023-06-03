import { Type } from '@sinclair/typebox';
import { loadDefinitions } from './clientFactory';
const definitions = {
  getFormations: {
    method: 'GET',
    url: '/panorama/filters',
    schema: {
      querystring: Type.Object({
        offset: Type.Optional(Type.Number()),
        limit: Type.Optional(Type.Number()),
      }),
      response: {
        200: Type.Object({
          count: Type.Number(),
          formations: Type.String(),
        }),
      },
    },
  },
} as const;

const [createClient, schema] = loadDefinitions(definitions);
const client = createClient({} as any);

async () => {
  const aa = await client.getFormations({ query: { limit: 1 } });
};
const sc = schema.getFormations;
