<h1 align="center">http-wizard</h1>
<p align="center"><a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&pause=2000&center=true&width=540&height=80&lines=First+class+api+client+for+node+servers." alt="Typing SVG" /></a></p>

### Full documentation website:

[http-wizard.vercel.app](https://http-wizard.vercel.app)

## Introduction

Http-wizard weaves TypeScript magic, offering a type-safe API client and ensuring a delightful end-to-end developer experience. ✨

#### Here is an example of usage

https://github.com/flodlc/http-wizard/assets/3781663/71c749f0-3493-4865-8a9a-41421a371a05

### What it can do:

- 100% type-safe api client with typescript magic (no code generation)
- Fastify first-class support
- React-query first-class support
- Zod and Typebox Type providers
- Delightful end-to-end developer experience (tRPC-like)
- Http standards / REST compatibility: you are owner of your routes
- Type inference utils

---

Table of Contents:

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

To get started, install http-wizard using npm or yarn:

```sh
npm install @http-wizard/core
# or
yarn add @http-wizard/core
```

## Usage

Currently http-wizard uses Zod or Typebox for validation.
Here is an example with Zod.

Let's first create a route on the server:

```typescript title="Route creation with Fastify and Zod"
// server.ts
import { createRoute } from '@http-wizard/core';
import { z } from 'zod';

const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUsers = (fastify: FastifyInstance) => {
  return createRoute('/users', {
    method: 'GET',
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

const router = { ...getUsers() };
export type Router = typeof router;
```

Now, let's use the Router type on the client:

```typescript title="Client instanciation with axios"
// client.ts
import { createClient, ZodTypeProvider } from '@http-wizard/core';
import axios from 'axios';

import type { Router } from './server';

const apiClient = createClient<Router, ZodTypeProvider>(axios.instance());
const users = await apiClient.ref('[GET]/users').query({});
// users array is safe: { id:string, name:string }[]
```

Easy, right?
