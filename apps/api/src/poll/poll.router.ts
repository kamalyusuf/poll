import { Router } from "express";
import { celebrate } from "../lib/celebrate.js";
import Joi from "joi";
import type { CreatePollPayload, VotePollPayload } from "types";
import { BadRequestError, NotFoundError } from "@kamalyb/errors";
import { Poll } from "./poll.model.js";
import { validate, version, v4 } from "uuid";
import { Vote } from "./vote.model.js";
import { agenda } from "../lib/agenda.js";
import { io } from "../lib/io.js";
import {
  isisodate,
  isobjectid,
  timeisafter,
  usetransaction
} from "../utils/index.js";

export const router = Router();

const v4validate = (text: string) => validate(text) && version(text) === 4;

router.post(
  "/",
  celebrate({
    body: Joi.object({
      title: Joi.string().min(2),
      options: Joi.array().min(2).items(Joi.string()),
      expires_at: Joi.string()
        .optional()
        .custom((value: string, helpers) =>
          isisodate(value) ? value : helpers.error("custom.invalid")
        )
        .custom((value: string, helpers) =>
          timeisafter(new Date(value)) ? helpers.error("custom.after") : value
        )
    }).options({
      messages: {
        "custom.invalid": "invalid expires at. must be an iso string",
        "custom.after": "at least 5 minutes from now"
      }
    })
  }),
  async (req, res) => {
    const body = req.body as CreatePollPayload;

    const poll = await Poll.create({
      title: body.title,
      expires_at: body.expires_at,
      options: body.options.map((option) => ({ value: option }))
    });

    if (poll.expires_at)
      await agenda.schedule(poll.expires_at, "end poll", { poll_id: poll._id });

    res.status(201).json(poll);
  }
);

router.put(
  "/:id/vote",
  celebrate({
    body: Joi.object({
      option_id: Joi.string()
    })
  }),
  async (req, res) => {
    const body = req.body as VotePollPayload;

    const poll = await Poll.findById(req.params.id).orFail(
      new NotFoundError("no poll found")
    );

    if (poll.expired()) throw new BadRequestError("poll not active");

    const xvid = req.headers["x-vid"] as string | undefined;

    if (xvid) {
      if (!v4validate(xvid)) throw new BadRequestError("nice try");

      if (await Vote.exists({ poll_id: poll._id, vid: xvid }))
        throw new BadRequestError("you already voted");
    }

    const option = poll.options.find(
      (option) => option._id.toString() === body.option_id
    );

    if (!option) throw new BadRequestError("invalid option");

    option.votes += 1;

    const vid = xvid ?? v4();

    await usetransaction(async (session) => {
      await poll.save({ session });

      return Vote.create([{ poll_id: poll._id, vid }], { session });
    });

    io.connection.to(poll._id.toString()).emit("poll voted", poll);

    res.json({
      vid,
      poll
    });
  }
);

router.get(
  "/:id",
  celebrate({
    body: Joi.object({
      id: Joi.string()
        .custom((value: string, helpers) =>
          isobjectid(value) ? value : helpers.error("any.custom")
        )
        .options({
          messages: {
            "any.custom": "invalid id"
          }
        })
    })
  }),
  async (req, res) => {
    res.json(
      await Poll.findById(req.params.id).orFail(
        new NotFoundError("poll not found")
      )
    );
  }
);
