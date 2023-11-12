---
sidebar_position: 3
---

# React-Query integration

## Installation

To get started, install http-wizard using npm or yarn:

```bash title="install @http-wizard/react-query"
npm install @http-wizard/core @http-wizard/react-query zod axios
# or
yarn add @http-wizard/core @http-wizard/react-query zod axios
```

`@http-wizard/react-query` provides a wrapper of http-wizard with additional react-query functions.

#### Currently supported React-Query features include:

- useQuery
- useMutation
- useInfiniteQuery
- prefetchQuery

Let's instantiate our apiClient with @http-wizard/react-query. Instead of createClient, we use createQueryClient.

```typescript title="Client instanciation with axios"
// client/apiClient.ts
import axios from "axios";
import { createQueryClient, ZodTypeProvider } from "@http-wizard/react-query";

import type { Router } from "server";

export const apiClient = createQueryClient<Router, ZodTypeProvider>(
  axios.instance()
);
```

```tsx title="apiClient usage with useQuery"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

const MyComponent = () => {
  // user is safe: { id:string, name:string }
  const { data: user } = apiClient
    .ref("[GET]/user/:id")
    .useQuery({ params: { id: "1" } });

  if (isLoading) return <div>loading...</div>;
  return <div>{user.name}</div>;
};
```

```tsx title="apiClient usage with useMutation"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

const MyComponent = () => {
  const { mutate } = apiClient.ref("[POST]/user").useMutation();
  return (
    <button onClick={() => mutate({ body: { name: "John" } })}>
      Create a user
    </button>
  );
};
```

React query functions take many options.  
[Full React-query doc is available here](https://tanstack.com/query/latest/docs/react/overview).

Enjoy!
