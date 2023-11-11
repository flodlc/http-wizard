---
sidebar_position: 5
---

# Recommended Architecture

Http-wizard is unopinionated, so you're free to organize your routes however you prefer. It can be adapted to most architectures.

That said, here's an architecture approach that works great. It promotes a clean structure with both vertical and horizontal code separation:

```
├── src
│   ├── repositories
│   │   ├── repositories
│   │   │   └── user.repository.ts
│   ├── usecases
│   │   ├── createUser
│   │   │   ├── createUser.route.ts
│   │   │   └── createUser.usecase.ts
│   │   ├── getUserById
│   │   │   ├── getUserById.route.ts
│   │   │   └── getUserById.usecase.ts
└── package.json
```

Typically, each xxx.route.ts file will look something like this:

```typescript title="Route creation"
// src/usecases/getUserById/getUserById.route.ts
import { createRoute } from "@http-wizard/core";
import { z } from "zod";

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUserByIdRoute = (fastify: FastifyInstance) => {
  return createRoute("/user/:id", {
    method: "GET",
    schema: {
      response: {
        200: User,
      },
    },
  }).handle((props) => {
    // ... create your server route as usual
  });
};
```

This approach embraces the code colocation principle:

<i>«keep the code that changes together close together»</i>

Then, create your Router type:

```typescript title="Export Router type"
// index.ts

import { getUserByIdRoute } from "src/usecases/getUserById/getUserById.route.ts";
import { createUserRoute } from "src/usecases/createUser/createUser.route.ts";

export const registerRoutes = (instance: FastifyInstance) => ({
  ...getUserByIdRoute(instance),
  ...createUserRoute(instance),
});

export type Router = ReturnType<typeof registerRoutes>;
```

Don't forget to export the Router type from your backend package, it will be used for creating a typesafe client in you front packages !
