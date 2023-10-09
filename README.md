<h1 align="center">ts-fastify-client</h1>
<p align="center"><a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&pause=2000&center=true&width=540&height=80&lines=First+class+api+client+for+fastify." alt="Typing SVG" /></a></p>

### ts-fastify-client is a simple client for Zod and Typebox schema based api using:

- Fully written in TypeScript
- Native Zod support
- Native Typebox support
- axios (more http client supported soon) as a http client

---

Table of Contents:

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

To get started, install ts-fastify-client using npm or yarn:

```sh
npm install ts-fastify-client
# or
yarn add ts-fastify-client
```

## Usage with Zod

### Route definitions and api calls

```typescript
import { loadRouteDefinitions, createRouteDefinition, z } from 'ts-fastify-client';

const definitions = {
  getUser: createRouteDefinition({
    method: 'GET',
    // Id parameter is dynamicaly injected in the final url.
    url: `/user/:id`,
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.array(
          z.object({
            name: z.string(),
            age: z.number(),
          })
        ),
      },
    },
  }),
};

const [createClient, schemas] = loadRouteDefinitions(definitions);

// fastify
server.get('/user', { schema: schemas.getUser }, async (request, response) => {
  response.status(200).send([{ name: 'John', age: 30 }]);
});

// client
const apiClient = createClient(axios.create({ baseURL: 'localhost' }));

async () => {
  const user = await apiClient.getUser({ params: { id: 'my-user-id' } }).call();
  // { name: 'John', age: 30 }
};
```

### Inject URL params

ts-fastify-client use the `/my-url/:my-param` syntax to inject given parameters in the final url.

### Access the final URL

Sometime, instead of calling the client method you will want to get the computed url. It's usefull to use it as a link href for instance.

```typescript
const url = await apiClient.getUser({ params: { id: 'my-user-id' } }).url;
// https://localhost/user/my-user-id
```

## Usage with Typebox

### Route definitions and api calls

```typescript
import { loadRouteDefinitions, createRouteDefinition, Type } from 'ts-fastify-client';

const definitions = {
  getUser: createRouteDefinition({
    method: 'GET',
    // Id parameter is dynamicaly injected in the final url.
    url: `/user/:id`,
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Array(
          Type.Object({
            name: Type.String(),
            age: Type.Number(),
          })
        ),
      },
    },
  }),
};

const [createClient, schemas] = loadRouteDefinitions(definitions);

// fastify
server.get('/user', { schema: schemas.getUser }, async (request, response) => {
  response.status(200).send([{ name: 'John', age: 30 }]);
});

// client
const apiClient = createClient(axios.create({ baseURL: 'localhost' }));

async () => {
  const user = await apiClient.getUser({ params: { id: 'my-user-id' } }).call();
  // { name: 'John', age: 30 }
};
```

### Inject URL params

ts-fastify-client use the `/my-url/:my-param` syntax to inject given parameters in the final url.

### Access the final URL

Sometime, instead of calling the client method you will want to get the computed url. It's usefull to use it as a link href for instance.

```typescript
const url = await apiClient.getUser({ params: { id: 'my-user-id' } }).url;
// https://localhost/user/my-user-id
```

---

That's it! You can now use ts-fastify-client to create fully typed and safe api client.
