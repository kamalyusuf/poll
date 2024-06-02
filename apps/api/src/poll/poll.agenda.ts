import type { Types } from "mongoose";
import { agenda } from "../lib/agenda";
import { type Job } from "agenda";
import { Poll } from "./poll.model";
import { io } from "../lib/io";

agenda.define(
  "end poll",
  {
    shouldSaveResult: false
  },
  async (job: Job<{ poll_id: Types.ObjectId }>) => {
    const poll = await Poll.findById(job.attrs.data.poll_id);

    if (!poll) return Promise.resolve();

    io.connection.to(poll._id.toString()).emit("poll ended", poll.toJSON());
  }
);
