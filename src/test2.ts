import { createClient } from "./proxyFactory";
import { getUser, postPet, getRandomUser } from "./test1";

const instance = { route: (a: unknown) => {} };

const router = {
  ...getUser(instance),
  ...postPet(instance),
  ...getRandomUser(instance),
};

type Router = typeof router;

const client = createClient<Router>({} as any);
type client = typeof client;

const user = client.route("[GET]/user", { params: { id: "sdf" } }).call();
const user = client.route("[GET]/user/rd", {}).call();

const dog = client
  .route("[POST]/pet", { params: { idff: "sdfd" } }, { headers: {} })
  .call();
