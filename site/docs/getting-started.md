---
sidebar_position: 2
---

# Getting started

## Installation

To get started, install http-wizard using npm or yarn:

```bash title="command"
npm install http-wizard
# or
yarn add http-wizard
```

## How it works ?

Currently http-wizard uses Zod or Typebox for validation.
Here is an exemple with Zod.

Let's first create a route on the server:

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

```typescript title="Client instancation with axios"
// client.ts
import { createClient } from "http-wizard";
import axios from "axios";

import type { Router } from "./server";

const apiClient = createClient<Router>(axios.instance());
const users = await apiClient["get/users"]({}).call();
// users array is safe: { id:string, name:string }[]
```

Easy right ?
