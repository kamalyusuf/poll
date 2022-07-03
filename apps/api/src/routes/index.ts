import { useGlobalErrorHandler } from "../middlewares/error";
import { Router } from "express";
import { router as PollRouter } from "../modules/poll/poll.route";
import { NotFoundError } from "@kamalyb/errors";
import * as Sentry from "@sentry/node";

export const router = Router();

router.use("/api/polls", PollRouter);

router.get(["/", "/api", "/health", "/api/health"], (req, res) =>
  res.send({ ok: true })
);

router.use(Sentry.Handlers.errorHandler());

router.use((_, __, ___) => {
  throw new NotFoundError("no route found");
});

router.use(useGlobalErrorHandler);

require("express-list-routes")(router);
