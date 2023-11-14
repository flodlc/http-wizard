---
sidebar_position: 1
---

# Usage on the server

Http-wizard is made for Fastify but can be used with all node servers through custom adapters.  
On the server, http-wizard is mainly used to link the route validation schemas with the exported `Router` type.

### Basic example of route definition

```typescript title="basic route definition"
// server/getUserById.ts
import { createRoute } from '@http-wizard/core';
import { z } from 'zod';

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUserByIdRoute = (fastify: FastifyInstance) => {
  return createRoute('get/user/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.array(User),
      },
    },
  }).handle((props) => {
    fastify.route({
      // schema, url and method props are used by fastify to define the route
      ...props,
      handler: (request) => {
        const user = await db.getUserById(request.params.id);
        return user;
      },
    });
  });
};
```

In this example, we create a `[get]` route on the `/user` uri.  
The schema requires an `id` input parameter and ensures an array of users as a response (code: 200).
In this case, validation is managed by fastify.

As you can see, we export the returned object from createRoute. It's very important and will be used to export the Router type from the server.

### Fastify instanciation and Router export

Let's create the fastify server with zod validation and export the Router type!

```typescript title="Router type export"
//server/index.ts
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { getUserById } from './getUserById.ts';

export const server = fastify().withTypeProvider<ZodTypeProvider>();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
export type Server = typeof server;

const router = { ...getUserByIdRoute(server) };
export type Router = typeof router;
```

The Router type is necessary on the client side for the instantiation of http-wizard.
In a monorepo architecture, you import it as an internal package from the client.

You're all set to use http-wizard on the [client side](/recipes/client-usage)!

### Custom repsonse code

By default, the type definition is inferred from the 200 response schema.  
The property `okCode` allows inferring the response type from a given response code.

```typescript title="Usage of okCode property"
// server/getUserById.ts
import { createRoute } from '@http-wizard/core';
import { z } from 'zod';

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUserByIdRoute = (fastify: FastifyInstance) => {
  return createRoute('/user/:id', {
    method: 'GET',
    okCode: 201,
    schema: {
      response: {
        201: User,
      },
    },
  }).handle((props) => {
    // ... create your server route as usual
  });
};
```
