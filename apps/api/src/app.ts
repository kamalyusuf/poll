import "express-async-errors";
import cors from "cors";
import express from "express";
import { env } from "./lib/env.js";
import helmet from "helmet";
import { NotFoundError } from "@kamalyb/errors";
import { useglobalerrorhandler } from "./middlewares/error.js";
import { router as pollrouter } from "./poll/poll.router.js";
import { agenda } from "./lib/agenda.js";
import agendash from "agendash";
import listroutes from "express-list-routes";
import { useexplorer } from "./middlewares/explorer.js";
import { simplepass } from "./lib/simple-pass.js";

export const app = express();

app.set("trust proxy", true);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'unsafe-inline'", "https://cdn.jsdelivr.net", "'self'"],
        "script-src-attr": ["'unsafe-inline'"]
      }
    }
  })
);
app.use(express.json());
app.use(cors({ origin: env.WEB_URL.split(",") }));

app.get("/", (_req, res) => {
  res.send({ ok: true, uptime: process.uptime() });
});

if (env.PASS_KEY && env.SECRET) {
  app.use(simplepass.router());
  useexplorer(app);
  app.use("/agendash", simplepass.usepass.bind(simplepass), agendash(agenda));
}

app.use("/api/polls", pollrouter);

app.use((req, __, next) => {
  next(new NotFoundError(`route: ${req.method} ${req.url} not found`));
});

app.use(useglobalerrorhandler);

listroutes(app, { spacer: 6 });
