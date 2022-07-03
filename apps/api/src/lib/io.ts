import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { env } from "./env";
import { createAdapter } from "@socket.io/redis-adapter";
import { redis } from "./redis";

export class SocketIO {
  private _io?: SocketServer;

  initialize(server: Server) {
    if (this._io) return;

    this._io = new SocketServer(server, {
      cors: {
        origin: [env.WEB_URL],
        credentials: true
      },
      serveClient: false,
      pingTimeout: 60000,
      pingInterval: 15000,
      transports: ["websocket"]
    });

    this._io.adapter(createAdapter(redis.duplicate(), redis.duplicate()));

    this._io.on("connection", (socket) => {
      socket.on("join poll", (id: string) => {
        socket.join(id);
      });

      socket.on("leave poll", (id: string) => {
        socket.leave(id);
      });
    });

    return this._io;
  }

  get() {
    if (!this._io) throw new Error(`io is not initialized. call 'init()'`);

    return this._io;
  }
}

export const io = new SocketIO();
