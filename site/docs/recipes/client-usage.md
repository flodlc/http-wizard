---
sidebar_position: 2
---

# Usage on the client

### <i>✨ Client side is where http-wizard starts to shine ✨</i>

On the client side, we need the exported `Router` type from the server and http-wizard installed.

Let's instantiate our apiClient!

```typescript title="Client instancation with axios"
// client/apiClient.ts
import axios from "axios";
import { createClient, ZodTypeProvider } from "@http-wizard/core";

import type { Router } from "server";

export const apiClient = createClient<Router, ZodTypeProvider>(
  axios.instance()
);
```

```typescript title="apiClient usage"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

const user = await apiClient
  .ref("[GET]/user/:id")
  .query({ params: { id: "1" } });

// user is safe: { id:string, name:string }
```

Enjoy!
