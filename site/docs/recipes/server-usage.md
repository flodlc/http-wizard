---
sidebar_position: 1
---

# Usage on the server

On the server, ts-client is mainly used to link the route validation schemas with the exported `Router` type.  
`Router` type is what allows the typesafety on the client side.

basic exemple of route definition:

```typescript title="basic route definition"
// server/getUserById.ts
import { createRoute, z } from "ts-client";

export const getUserById = (fastify: FastifyInstance) => {
  return createRoute("get/user/:id", {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
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

const router = { ...getUserById() };
export type Router = typeof router;
```

Router type is the type of all the server routes.
Depends on your architecture you will import it from your client or export it through a package.

You're all set to use ts-client on the [client side](/docs/recipes/client-usage) !
