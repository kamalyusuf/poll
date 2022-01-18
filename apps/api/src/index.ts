import "colors";
import { Server } from "http";
import { _app } from "./app";

let server: Server;

const bootstrap = async () => {
  server = await _app.serve();
};

bootstrap().catch((e) => {
  console.log("bootstrap.error", e);
  process.exit(1);
});
