import { Server } from "hapi";
import { routes, states } from "./routes";

interface IOpts {
  port?: string;
}

export default function(opts: IOpts = {}) {
  const server = new Server();
  server.connection({
    port: opts.port,
  });

  server.route(routes);
  states.forEach((state) => server.state(state.name, state.config));

  return server;
}
