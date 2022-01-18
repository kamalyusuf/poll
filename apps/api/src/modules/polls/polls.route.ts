import { Router } from "express";
import * as PollsController from "./polls.controller";
import { v } from "./polls.validation";

export const router = Router();

router.post("/", v.create, PollsController.Create);

router.post("/:id/vote", v.vote, PollsController.Vote);

router.get("/:id", v["get-by-id"], PollsController.GetById);
