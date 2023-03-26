import { Types } from "mongoose";
import { agenda } from "../lib/agenda";
import { Job } from "agenda";
import { usetransaction } from "../utils";
import { Poll } from "./poll.model";
import { PollVote } from "./poll-vote.model";
import { io } from "../lib/io";

agenda.define(
  "end poll",
  {
    shouldSaveResult: false
  },
  async (job: Job<{ poll_id: Types.ObjectId }>) => {
    const poll = await Poll.findById(job.attrs.data.poll_id);

    if (!poll) return Promise.resolve();

    await usetransaction(async (session) => {
      await poll.set({ status: "ended" }).save({ session });

      return PollVote.deleteMany({ poll_id: poll._id }, { session });
    });

    io.connection.to(poll._id.toString()).emit("poll ended", poll);
  }
);
