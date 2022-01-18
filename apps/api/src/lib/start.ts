import { Application } from "express";
import { Server } from "http";
import { env } from "./env";
import { logger } from "./logger";

export const start = async (app: Application): Promise<Server> => {
  const port = env.PORT;
  const server = await new Promise<Server>((resolve) => {
    const server = app.listen(port);

    resolve(server);
  });

  server.on("listening", () => {
    logger.info(`app on http://localhost:${port}`.green);
  });

  server.on("error", (error) => {
    console.log("server.error".red);
    console.error(error);
    process.exit(1);
  });

  return server;
};
