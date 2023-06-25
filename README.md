<h1 align="center">tsclient</h1>
<p align="center"><a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&pause=2000&center=true&width=540&height=80&lines=First+class+api+client+for+fastify." alt="Typing SVG" /></a></p>

### tsclient is a simple client for Typebox schema based api using:

- Fully written in TypeScript
- Typebox for easy json-schema writting
- axios (more http client supported soon) as a http client

---

Table of Contents:

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

To get started, install tsclient using npm or yarn:

```sh
npm install tsclient
# or
yarn add tsclient
```

## Usage

```typescript
import { loadDefinitions } from 'tsclient';

const definitions = {
  getUsers: {
    method: 'GET',
    url: '/users',
    schema: {
      querystring: Type.Object({
        offset: Type.Optional(Type.Number()),
        limit: Type.Optional(Type.Number()),
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
  },
} as const;

const { createClient, schema } = loadRouteDefinitions(definitions);

// fastify
server.get('/', { schema: schema.getUsers }, async (request, response) => {
  response.status(200).send([{ name: 'John', age: 30 }]);
});

// client
const apiClient = createClient(axios.create({ baseURL: 'localhost' }));

async () => {
  const users = await apiClient.getUsers({ query: { limit: 1 } });
};
```

---

That's it! You can now use Tsclient to create fully typed and safe api client.
