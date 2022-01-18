import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { env } from "./env";
import { createAdapter } from "@socket.io/redis-adapter";
import { redis } from "./redis";
import { logger } from "./logger";

class SocketIO {
  private _io?: SocketServer;

  init(server: Server) {
    if (this._io) return;

    this._io = new SocketServer(server, {
      cors: {
        origin: [env.WEB_URL],
        credentials: true
      },
      serveClient: false,
      pingTimeout: 60000,
      pingInterval: 15000
    });

    this._io.adapter(createAdapter(redis.duplicate(), redis.duplicate()));

    this._io.on("connection", this.onConnection);

    return this._io;
  }

  get() {
    if (!this._io) {
      throw new Error(`io is not initialized. call 'init()'`);
    }

    return this._io;
  }

  onConnection(socket: Socket) {
    logger.log({
      level: "info",
      dev: true,
      message: `socket ${socket.id} connected`.cyan
    });

    socket.on("join poll", (id: string) => {
      socket.join(id);
    });

    socket.on("leave poll", (id: string) => {
      socket.leave(id);
    });

    socket.on("disconnect", (reason) => {
      logger.log({
        level: "info",
        dev: true,
        message: `socket ${socket.id} disconnected because ${reason}`.magenta
      });
    });
  }
}

export const io = new SocketIO();
