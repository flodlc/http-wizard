---
sidebar_position: 4
---

# Type inference

You will often want to manipulate a type corresponding to a route response.

Let's create a client:

```typescript title="Create client"
// client/apiClient.ts
import axios from "axios";
import { createClient } from "@http-wizard/core";

import type { Router } from "server";

export const apiClient = createClient<Router>(axios.instance());
```

Here is how to infer the response type from the route key.  
The infer property is made for this.

```typescript title="apiClient usage"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

type User = (typeof apiClient.infer)["[GET]/user/:id"];
// { id:string, name:string }
```
