import { getUserRoute } from './getUser.route';
import { server } from './server';

const router = { ...getUserRoute(server) };

export type Router = typeof router;

server.listen({ port: 5000, host: '0.0.0.0' }, () => {
  console.log('server listening');
});
