import { consola } from "consola";
import { type Server } from "node:http";
import { mongo } from "./lib/mongo";
import { app } from "./app";
import { env } from "./lib/env";
import { io } from "./lib/io";
import { start } from "./utils";
import { agenda } from "./lib/agenda";
import "./poll/poll.agenda";

let server: Server;

const bootstrap = async () => {
  await Promise.all([mongo.connect(env.MONGO_URL), agenda.start()]);

  server = await start({ app, port: env.PORT });

  io.initialize(server);
};

bootstrap().catch((e) => {
  consola.error("bootstrap.error", e);

  process.exit(1);
});
