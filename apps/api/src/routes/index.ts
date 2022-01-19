import { useGlobalErrorHandler } from "../middlewares/error";
import { Router } from "express";
import listRoutes from "@kamalyb/express-list-routes";
import { router as PollsRouter } from "../modules/polls/polls.route";
import { NotFoundError } from "@kamalyb/errors";
import * as Sentry from "@sentry/node";

export const router = Router();

router.use("/api/polls", PollsRouter);

router.use(Sentry.Handlers.errorHandler());

router.use((_, __, ___) => {
  throw new NotFoundError("no route found");
});

router.use(useGlobalErrorHandler);

listRoutes(router);
