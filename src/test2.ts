import { createClient } from "./proxyFactory";
import { getUser } from "./test1";

const instance = { route: (a: unknown) => {} };

const router = { ...getUser(instance) };

type Router = typeof router;

const client = createClient<Router>({} as any);

const user = client.getUser({ params: { id: "sdf" } }).call();
