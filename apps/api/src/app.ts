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
import { useexplorer, usepass, usesimplepass } from "mongoose-explorer";
import cookiesession from "cookie-session";

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

usesimplepass({
  app,
  passkey: env.PASS_KEY,
  redirect_path: "/"
});

useexplorer({
  app,
  mongoose,
  rootpath: "/explorer",
  authorize: usepass,
  models: {
    Poll: {
      properties: {
        title: {
          iseditable: false
        },
        status: {
          iseditable: false
        },
        expires_at: {
          iseditable: false
        }
      }
    },
    PollVote: {
      properties: {
        poll_id: {
          iseditable: false
        },
        vid: {
          iseditable: false
        }
      }
    }
  }
});

app.use("/agendash", usepass, require("agendash")(agenda));

app.use("/api/polls", pollrouter);

app.use((_, __, ___) => {
  throw new NotFoundError("no route found");
});

app.use(useglobalerrorhandler);

require("express-list-routes")(app);
