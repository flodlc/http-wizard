---
sidebar_position: 2
---

# Getting started

## Installation

To get started, install http-wizard using npm or yarn:

```bash title="command"
npm install @http-wizard/core zod axios
# or
yarn add @http-wizard/core zod axios
```

## How it works ?

Currently http-wizard uses Zod or Typebox for validation.
Here is an exemple with Zod.

Let's first create a route on the server:

```typescript title="Route creation with Fastify and Zod"
// server.ts
import { createRoute } from "@http-wizard/core";
import { z } from "zod";

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUsersRoute = (fastify: FastifyInstance) => {
  return createRoute("/users", {
    method: "GET",
    schema: {
      response: {
        200: z.array(User),
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

const router = { ...getUsersRoute() };
export type Router = typeof router;
```

Now, let's use the Router type on the client:

```typescript title="Client instancation with axios"
// client.ts
import { createClient, ZodTypeProvider } from "@http-wizard/core";
import axios from "axios";

import type { Router } from "./server";

const apiClient = createClient<Router, ZodTypeProvider>(axios.instance());
const users = await apiClient.ref("[GET]/users").query({});
// users array is safe: { id:string, name:string }[]
```

Easy right ?
