import { Server } from "hapi";
import Yargs = require("yargs");
import { routes, states } from "./routes";

interface IArgs extends Yargs.Argv {
  port: string;
}

const argv = Yargs
  .usage("Usage: $0 --port [num]")
  .demand(["port"])
  .argv as IArgs;

const server = new Server();
server.connection({
  port: argv.port,
});

server.route(routes);
states.forEach((state) => server.state(state.name, state.config));

server.start((err) => {
  if (err) {
    throw err;
  }
  // tslint:disable:no-console
  console.log("Server running at:", server.info.uri);
});
