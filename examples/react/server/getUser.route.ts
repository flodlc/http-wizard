import { createRoute } from '@http-wizard/core';
import { z } from 'zod';

import { Server } from './server';

export const getUserRoute = (server: Server) => {
  return createRoute('/user', {
    method: 'GET',
    schema: {
      response: {
        200: z.object({
          name: z.string(),
          age: z.number(),
        }),
      },
    },
  }).handle((props) => {
    server.route({
      ...props,
      handler: (_, response) => {
        response.code(200).send({ name: 'John', age: 30 });
      },
    });
  });
};
