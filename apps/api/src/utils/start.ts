import { Express } from "express";
import { Server } from "http";
import { logger } from "../lib/logger";

export const start = ({
  app,
  port
}: {
  app: Express;
  port: number;
}): Promise<Server> =>
  new Promise<Server>((resolve, reject) => {
    const server = app.listen(port);

    server.on("listening", () => {
      logger.info(`api on http://localhost:${port}`.green);
      resolve(server);
    });

    server.on("error", (error) => {
      reject(error);
    });
  });
