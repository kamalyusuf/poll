import { redis } from "../../lib/redis";
import { PollRepository } from "./poll.repository";
import { CreatePollPayload, PollStatus, VotePollPayload } from "types";
import { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "@kamalyb/errors";
import { PollDoc } from "./poll.model";
import _ from "lodash";
import { io } from "../../lib/io";
import { Request } from "express";
import { v4, validate, version } from "uuid";

const v4Validate = (text: string) => validate(text) && version(text) === 4;

export class PollService {
  constructor(private readonly pollRepo: PollRepository) {}

  async create({ title, options, expires_at }: CreatePollPayload) {
    const poll = await this.pollRepo.createOne({
      title,
      options: options.map((option) => ({ value: option })),
      expires_at: expires_at
    } as any);

    await deps.queue.poll.add({
      _id: poll._id.toString(),
      expires_at: poll.expires_at
    });

    return poll;
  }

  async findById(_id: Types.ObjectId) {
    const poll = await this.pollRepo.findById(_id);

    if (!poll) throw new NotFoundError("no poll found");

    return poll;
  }

  async vote(req: Request, poll: PollDoc, { option_id }: VotePollPayload) {
    const xvid = req.headers["x-vid"] as string | undefined;

    if (
      !(await this.pollRepo.exists({
        _id: poll._id,
        "options._id": option_id,
        status: PollStatus.ACTIVE
      }))
    )
      throw new NotFoundError("no poll found");

    if (xvid) {
      if (!v4Validate(xvid)) throw new BadRequestError("nice try");

      if (await redis.sismember(poll._id.toString(), xvid))
        throw new BadRequestError("you already voted");
    }

    await this.pollRepo.updateOne(
      {
        _id: poll._id,
        "options._id": option_id,
        status: PollStatus.ACTIVE
      },
      {
        $inc: {
          "options.$.votes": 1
        }
      }
    );

    const vid = xvid ?? v4();

    await redis.sadd(poll._id.toString(), vid);

    const p = await this.findByIdWithAgg(poll._id);

    io.get().to(poll._id.toString()).emit("poll voted", p);

    return { poll: p, vid };
  }

  async findByIdWithAgg(_id: Types.ObjectId) {
    const [poll] = await this.pollRepo.aggregate([
      {
        $match: {
          _id
        }
      },
      {
        $addFields: {
          total_votes: {
            $sum: "$$ROOT.options.votes"
          }
        }
      }
    ]);

    if (!poll) throw new NotFoundError("no poll found");

    return poll;
  }

  async end(_id: Types.ObjectId) {
    await this.pollRepo.updateOne(
      {
        _id,
        status: PollStatus.ACTIVE
      },
      { status: PollStatus.ENDED }
    );

    await redis.del(_id.toString());

    return { _id, poll: await this.findByIdWithAgg(_id) };
  }
}
