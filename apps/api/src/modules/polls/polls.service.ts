import { redis } from "../../lib/redis";
import { pollsRepo, PollsRepository } from "./polls.repository";
import { CreatePollPayload, PollStatus, VotePollPayload } from "types";
import { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "@kamalyb/errors";
import { PollDoc } from "./poll.model";
import _ from "lodash";
import { pollQueue } from "./poll.queue";
import { io } from "../../lib/io";
import { Request } from "express";
import { nanoid } from "nanoid";

export class PollsService {
  constructor(private readonly pollsRepo: PollsRepository) {}

  async create({ title, options, expires_at }: CreatePollPayload) {
    const poll = await this.pollsRepo.createOne({
      title,
      options: options.map((option) => ({ value: option })) as any,
      expires_at: expires_at as any
    });

    await pollQueue.addToQueue(poll);

    return poll;
  }

  async findById(id: Types.ObjectId) {
    const poll = await this.pollsRepo.findById(id);
    if (!poll) {
      throw new NotFoundError("no poll found");
    }

    return poll;
  }

  async vote(req: Request, poll: PollDoc, { option_id }: VotePollPayload) {
    const xvid = req.headers["x-vid"] as string | undefined;

    if (
      !(await this.pollsRepo.exists({
        _id: poll._id,
        "options._id": option_id,
        status: PollStatus.ACTIVE
      }))
    ) {
      throw new BadRequestError("no poll found");
    }

    if (xvid && (await redis.sismember(poll._id.toString(), xvid))) {
      throw new BadRequestError("you already voted");
    }

    await this.pollsRepo.updateOne(
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

    const vid = xvid ?? nanoid();
    await redis.sadd(poll._id.toString(), vid);

    const p = await this.findByIdWithTotalVotes(poll._id);

    io.get().to(poll._id.toString()).emit("poll voted", p);

    return { poll: p, vid };
  }

  // note to self: aggregation does not return a mongoose document
  async findByIdWithTotalVotes(id: Types.ObjectId) {
    const polls = await this.pollsRepo.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id)
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
    if (!polls.length) {
      throw new NotFoundError("no poll found");
    }

    return polls[0];
  }

  async endPoll(id: Types.ObjectId) {
    await this.pollsRepo.updateOne(
      {
        _id: id,
        status: PollStatus.ACTIVE
      },
      { status: PollStatus.ENDED }
    );

    return this.findByIdWithTotalVotes(id);
  }
}

export const pollsService = new PollsService(pollsRepo);
