---
sidebar_position: 4
---

# Type inference

You will often want to manipulate a type corresponding to a route response.

Here is how to infer the response type from `http-wizard`.

### Response type inference

The infer property is made for this.

```typescript title="Response type inference"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

type User = (typeof apiClient.infer)["[GET]/user/:id"];
// { id: string, name: string }
```

### Args type inference

The infer property is made for this.

```typescript title="Args type inference"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

type User = (typeof apiClient.inferArgs)["[GET]/user/:id"];
// { query: { id: string } }
```
