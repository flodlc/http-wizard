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

const user = client.get("/user", { params: { id: "sdf" } }).call();
const user = client.get("/user/rd", {}).call();

const dog = client
  .post("/pet", { params: { idff: "sdfd" } }, { headers: {} })
  .call();
