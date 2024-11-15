import { consola } from "consola";
import type { Server } from "node:http";
import { mongo } from "./lib/mongo.js";
import { app } from "./app.js";
import { env } from "./lib/env.js";
import { io } from "./lib/io.js";
import { start } from "./utils/index.js";
import { agenda } from "./lib/agenda.js";
import { agend } from "./poll/poll.agenda.js";

let server: Server;

const bootstrap = async () => {
  agend(agenda);

  await Promise.all([mongo.connect(env.MONGO_URL), agenda.start()]);

  server = await start({ app, port: env.PORT });

  io.initialize(server);
};

bootstrap().catch((e) => {
  consola.error("bootstrap.error", e);

  process.exit(1);
});
