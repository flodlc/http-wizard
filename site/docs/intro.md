---
sidebar_position: 1
---

# Introduction

Ts-client is a type safe api-client designed to streamline the development of your application.  
It's fully complient with HTTP standards and allows easy usage of your api with non ts/js client.

### What it can do:

- Export a typesafe client api
- Validate input and output of your routes
- Drasticly simplify your codebase and ensure validation good practices
- Allow HTTP standards route naming and usage with or without ts-client.

### How it works ?

Currently ts-client uses Zod or Typebox for validation.
Here is an exemple with Zod.

Let's first create a route on the server:

```typescript title="Route creation with Fastify and Zod"
// server.ts
import { createRoute, z } from "ts-client";

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
import { createClient } from "ts-client";
import axios from "axios";

import type { Router } from "./server";

const apiClient = createClient<Router>(axios.instance());
const users = await apiClient.getUsers({}).call();
// users array is safe: { id:string, name:string }[]
```

Easy right ?  
Here is how to get it work in your project:
[getting-started](/docs/getting-started)
