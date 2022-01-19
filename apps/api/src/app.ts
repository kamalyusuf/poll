import "express-async-errors";
import cors from "cors";
import express, { Express } from "express";
import { Server } from "http";
import { env } from "./lib/env";
import { start } from "./lib/start";
import { router } from "./routes";
import * as mongo from "./lib/mongo";
import { pollQueue } from "./modules/polls/poll.queue";
import { io } from "./lib/io";
import helmet from "helmet";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

class App {
  private readonly _app: Express;
  public port: number;

  constructor() {
    this._app = express();
    this.port = env.PORT;

    this.configure();
  }

  get app() {
    return this._app;
  }

  private configure() {
    this._app.disable("x-powered-by");
    this._app.set("trust proxy", 1);
    this._app.use(helmet());
    this._app.use(express.json());
    this._app.use(cors({ origin: env.WEB_URL, credentials: true }));

    this.initSentry();

    this._app.use(Sentry.Handlers.requestHandler({ ip: true }));
    this._app.use(Sentry.Handlers.tracingHandler());

    this._app.use(router);
  }

  public async serve(): Promise<Server> {
    await mongo.connect(env.MONGO_URL);
    const server = await start(this._app);

    pollQueue.listen();
    io.init(server);

    return server;
  }

  private initSentry() {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      enabled: !!env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app: this._app })
      ],
      tracesSampleRate: 1.0
    });
  }
}

export const _app = new App();
