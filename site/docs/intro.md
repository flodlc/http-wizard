---
sidebar_position: 1
slug: /
---

# Introduction

Http-wizard is a type safe api-client designed to streamline the development of your application.  
It's fully compliant with HTTP standards and facilitates the easy usage of your API with non ts/js clients.

### What it can do:

- Export a type-safe client API
- Validate input and output of your routes
- Drastically simplify your codebase and ensure validation best practices
- Allow HTTP standards-compliant route naming and usage, with or without http-wizard as a client.

### Why not GraphQL or tRPC ?

Both are excellent choices!  
<b>Http-wizard</b> allows maintaining a standard HTTP API and to keep tools such as Swagger, etc to document your API.  
For people who wants a tRPC like DX but still using fastify or Express with full control over route naming, http-wizard is made for you !  
It combines the best of both worlds, ensuring a smooth, efficient, and productive development process.

### How it works ?

Currently, http-wizard utilizes Zod or Typebox for validation.
Here is an example with Zod.

First, let's create a route on the server:

```typescript title="Route creation with Fastify and Zod"
// server.ts
import { createRoute, z } from "http-wizard";

export const getUsers = (fastify: FastifyInstance) => {
  return createRoute("get/users", {
    schema: {
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
      ...props,
      handler: (request) => {
        const users = await db.getUsers();
        return users;
      },
    });
  });
};

const router = { ...getUsers() };
export type Router = typeof router;
```

Now, let's use the Router type on the client:

```typescript title="Client instanciation with axios"
// client.ts
import { createClient } from "http-wizard";
import axios from "axios";

import type { Router } from "./server";

const apiClient = createClient<Router>(axios.instance());
const users = await apiClient["get/users"]({}).call();
// users array is safe: { id:string, name:string }[]
```

Easy, right?
Here's how to integrate it into your project:
[getting-started](/getting-started)
