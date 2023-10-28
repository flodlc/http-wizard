---
sidebar_position: 2
---

# Usage on the client

### <i>✨ Client side is where http-wizard starts to shine ✨</i>

On the client side, we need the exported `Router` type from the server and having http-wizard installed.

Let's instanciate our apiClient !

```typescript title="Client instancation with axios"
// client/apiClient.ts
import axios from "axios";
import { createClient } from "http-wizard";

import type { Router } from "server";

export const apiClient = createClient<Router>(axios.instance());
```

```typescript title="apiClient usage"
// client/my-page.ts
import type { Router } from "server";
import { apiClient } from "./apiClient";

const users = await apiClient.getUserById({ params: { id: 1 } }).call();
// users array is safe: { id:string, name:string }[]
```

Enjoy !
