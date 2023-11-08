---
sidebar_position: 1
---

# Usage on the server

Http-wizard is made for Fastify but can be used with all node servers through custom adapters.  
On the server, http-wizard is mainly used to link the route validation schemas with the exported `Router` type.  
`Router` type is what allows the typesafety on the client side.

basic exemple of route definition:

```typescript title="basic route definition"
// server/getUserById.ts
import { createRoute, z } from "http-wizard";

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUserByIdRoute = (fastify: FastifyInstance) => {
  return createRoute("get/user/:id", {
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

In this exemple, we create a `[get]` route on the `/user` uri.  
The schema requires an `id` input parameter and ensure an array of users as a response (code: 200).
In this case, validation is managed by fastify.

As you can see, we export the returned object from createRoute. It's very important and will be used to export the Router type from the server.

Let's create and export the Router type !

```typescript title="Router type export"
//server/index.ts

import { getUserById } from "./getUserById.ts";

const router = { ...getUserByIdRoute() };
export type Router = typeof router;
```

Router type is the type of all the server routes.
Depends on your architecture you will import it from your client or export it through a package.

You're all set to use http-wizard on the [client side](/recipes/client-usage) !

### Custom repsonse code

By default, the type definition is inferred from the 200 response schema.  
The property `okCode` allows inferring the response type from a given response code.

```typescript title="Usage of okCode property"
// server/getUserById.ts
import { createRoute, z } from "http-wizard";

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUserByIdRoute = (fastify: FastifyInstance) => {
  return createRoute("/user/:id", {
    method: "GET",
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
