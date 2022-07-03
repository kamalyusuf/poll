import { env } from "../lib/env";
import { useGlobalErrorHandler } from "../middlewares/error";
import { RequestHandler, Router } from "express";
import { router as PollRouter } from "../modules/poll/poll.route";
import { NotFoundError } from "@kamalyb/errors";
import * as Sentry from "@sentry/node";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

export const router = Router();

if (env.isDev) {
  const adapter = new ExpressAdapter();

  adapter.setBasePath("/api/q");

  createBullBoard({
    queues: [
      new BullMQAdapter(deps.queue.poll.queue, {
        readOnlyMode: env.isProduction
      })
    ],
    serverAdapter: adapter
  });

  router.use("/api/q", adapter.getRouter() as RequestHandler);
}

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
