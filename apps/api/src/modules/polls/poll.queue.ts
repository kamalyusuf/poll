import { io } from "../../lib/io";
import { redis } from "../../lib/redis";
import { env } from "../../lib/env";
import { Queue, QueueScheduler, Job, Worker } from "bullmq";
import { Redis } from "ioredis";
import { PollDoc, PollProps } from "./poll.model";
import { logger } from "../../lib/logger";
import { pollsService } from "./polls.service";
import { Types } from "mongoose";

class PollQueue {
  private readonly _redis: Redis;
  public name = "poll";
  private readonly _queue: Queue;

  constructor(redis: Redis) {
    this._redis = redis;
    this._queue = new Queue(this.name, { connection: this._redis });

    this._queue.on("waiting", (job) => {
      logger.log({
        level: "info",
        dev: true,
        message: `poll queue waiting to process ${job.data}`
      });
    });
  }

  get queue() {
    if (!this._queue) {
      throw new Error("queue is not initialized");
    }

    return this._queue;
  }

  async addToQueue(poll: PollDoc) {
    if (!this._queue) {
      throw new Error("Queue is not initialized");
    }

    await this._queue.add(this.name, poll, {
      removeOnComplete: env.isProduction,
      removeOnFail: env.isProduction,
      attempts: 6,
      backoff: {
        type: "exponential",
        delay: 3000
      },
      delay: new Date(poll.expires_at).getTime() - new Date().getTime()
    });
  }

  listen() {
    new QueueScheduler(this.name, { connection: this._redis });
    const worker = new Worker(
      this.name,
      async (job: Job<PollDoc>) => {
        return this.process(job.data);
      },
      {
        connection: this._redis
      }
    );

    logger.info("poll worker listening".yellow);
  }

  private async process(data: Omit<PollProps, "_id"> & { _id: string }) {
    logger.log({
      level: "info",
      dev: true,
      message: `poll worker about to process ${data}`
    });

    try {
      const poll = await pollsService.endPoll(new Types.ObjectId(data._id));
      io.get().to(poll._id.toString()).emit("poll ended", poll);
    } catch (e) {
      if (env.isDevelopment) {
        console.log("worker.process error", e);
      }
    }
  }
}

export const pollQueue = new PollQueue(redis);
