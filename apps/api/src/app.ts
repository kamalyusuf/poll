import "express-async-errors";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import { env } from "./lib/env";
import helmet from "helmet";
import { NotFoundError } from "@kamalyb/errors";
import { useglobalerrorhandler } from "./middlewares/error";
import { router as pollrouter } from "./poll/poll.router";
import { agenda } from "./lib/agenda";
import { explore } from "mongoose-explore";
import cookiesession from "cookie-session";
import { simplepass, usepass } from "express-simple-pass";
import { PollProps } from "./poll/poll.model";

export const app = express();

app.set("trust proxy", true);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'unsafe-inline'"]
      }
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [env.WEB_URL]
  })
);
app.use(
  cookiesession({
    signed: false,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  })
);

app.get("/", (_req, res) => res.send({ ok: true, uptime: process.uptime() }));

simplepass({
  app,
  passkey: env.PASS_KEY,
  redirect: "/"
});

explore({
  app,
  mongoose,
  rootpath: "/explorer",
  authorize: usepass,
  models: {
    Poll: {
      virtuals: {
        votes: (poll: PollProps) =>
          `${poll.options.reduce((total, option) => total + option.votes, 0)}`
      }
    }
  }
});

app.use("/agendash", usepass, require("agendash")(agenda));

app.use("/api/polls", pollrouter);

app.use((req, __, next) => {
  next(new NotFoundError(`route: ${req.method} ${req.url} not found`));
});

app.use(useglobalerrorhandler);

require("express-list-routes")(app);
