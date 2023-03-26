import "express-async-errors";
import cors from "cors";
import express from "express";
import { env } from "./lib/env";
import helmet from "helmet";
import { NotFoundError } from "@kamalyb/errors";
import { useglobalerrorhandler } from "./middlewares/error";
import { router as pollrouter } from "./poll/poll.router";
import { agenda } from "./lib/agenda";

export const app = express();

app.set("trust proxy", true);
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [env.WEB_URL]
  })
);

app.get("/", (_req, res) => res.send({ ok: true, uptime: process.uptime() }));

if (env.isDev) app.use("/agendash", require("agendash")(agenda));

app.use("/api/polls", pollrouter);

app.use((_, __, ___) => {
  throw new NotFoundError("no route found");
});

app.use(useglobalerrorhandler);

require("express-list-routes")(app);
