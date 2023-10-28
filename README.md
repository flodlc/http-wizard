<h1 align="center">http-wizard</h1>
<p align="center"><a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&pause=2000&center=true&width=540&height=80&lines=First+class+api+client+for+node+servers." alt="Typing SVG" /></a></p>

### Full documentation website:

[http-wizard.vercel.app](https://http-wizard.vercel.app)

## Introduction

Http-wizard is a type safe api-client designed to streamline the development of your application.  
It's fully complient with HTTP standards and allows easy usage of your api with non ts/js client.

### What it can do:

- Export a typesafe client api
- Validate input and output of your routes
- Drasticly simplify your codebase and ensure validation good practices
- Allow HTTP standards route naming and usage with or without http-wizard.

---

Table of Contents:

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

To get started, install http-wizard using npm or yarn:

```sh
npm install http-wizard
# or
yarn add http-wizard
```

## Usage

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

```typescript title="Client instanciation with axios"
// client.ts
import { createClient } from "http-wizard";
import axios from "axios";

import type { Router } from "./server";

const apiClient = createClient<Router>(axios.instance());
const users = await apiClient.getUsers({}).call();
// users array is safe: { id:string, name:string }[]
```

Easy right ?
