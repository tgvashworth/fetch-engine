import Yargs = require("yargs");
import createServer from "./server";

interface IArgs extends Yargs.Argv {
  port: string;
}

const argv = Yargs
  .usage("Usage: $0 --port [num]")
  .demand(["port"])
  .argv as IArgs;

createServer(argv).start((err) => {
  if (err) {
    throw err;
  }
  // tslint:disable:no-console
  console.log("Server running at:", this.info.uri);
});
