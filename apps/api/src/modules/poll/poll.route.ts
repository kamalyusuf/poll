import { Router } from "express";
import { isIsoDate } from "../../utils/is-iso-date";
import { CreatePollPayload, VotePollPayload } from "types";
import { validator, s } from "../../lib/validator";
import { toObjectId, isValidObjectId } from "../../utils/mongo";

export const router = Router();

router.post(
  "/",
  validator.body(
    s.object<CreatePollPayload>({
      title: s.string().min(2),
      options: s.array().min(2).items(s.string()),
      expires_at: s.string().custom((value) => {
        if (!isIsoDate(value))
          throw new Error("expected expires at to be iso string");

        return value;
      })
    })
  ),
  async (req, res) => {
    const poll = await deps.poll.create(req.body);

    res.status(201).send(poll);
  }
);

router.post(
  "/:id/vote",
  validator.body(
    s.object<VotePollPayload>({
      option_id: s.string()
    })
  ),
  async (req, res) => {
    const id = req.params.id;

    const poll = await deps.poll.vote(
      req,
      await deps.poll.findById(toObjectId(id)),
      req.body
    );

    res.send(poll);
  }
);

router.get(
  "/:id",
  validator.params(
    s.object<{ id: string }>({
      id: s
        .string()
        .custom((value, helpers) => {
          if (!isValidObjectId(value)) return helpers.error("any.custom");

          return value;
        })
        .options({
          messages: {
            "any.custom": "invalid id"
          }
        })
    })
  ),
  async (req, res) => {
    const poll = await deps.poll.findByIdWithAgg(toObjectId(req.params.id));

    res.send(poll);
  }
);
