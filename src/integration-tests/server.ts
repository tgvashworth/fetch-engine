import { Server } from "hapi";
import Yargs = require("yargs");
import { routes } from "./routes";

interface Args extends Yargs.Argv {
  port: string;
}

const argv = <Args>Yargs
  .usage("Usage: $0 --port [num]")
  .demand(["port"])
  .argv;

const server = new Server();
server.connection({
  port: argv.port
});

server.route(routes);

server.start(err => {
  if (err) {
    throw err;
  }
  console.log("Server running at:", server.info.uri);
});
