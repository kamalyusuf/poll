import { Application } from "express";
import { Server } from "http";
import { env } from "./env";
import { logger } from "./logger";

export const start = async (app: Application): Promise<Server> => {
  const port = env.PORT;
  return await new Promise<Server>((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`app on http://localhost:${port}`.green);
    });

    resolve(server);
  });
};
