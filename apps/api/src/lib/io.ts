import { type Server } from "node:http";
import { type Socket, Server as SocketServer } from "socket.io";
import { env } from "./env";
import { saferun } from "../utils";

class SocketIO {
  private io?: SocketServer;

  get connection() {
    if (!this.io) throw new Error("io not initialized");

    return this.io;
  }

  initialize(server: Server) {
    if (this.io) return;

    this.io = new SocketServer(server, {
      cors: {
        origin: [env.WEB_URL],
        credentials: true
      },
      serveClient: false,
      pingTimeout: 60000,
      pingInterval: 15000,
      transports: ["websocket", "polling"]
    });

    this.io.on("connection", (socket) => this.onconnection(socket));

    return this.io;
  }

  private onconnection(socket: Socket) {
    socket.on("join poll", (id: string) => {
      saferun(() => socket.join(id));
    });

    socket.on("leave poll", (id: string) => {
      saferun(() => socket.leave(id));
    });
  }
}

export const io = new SocketIO();
