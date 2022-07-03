import { logger } from "../../lib/logger";
import { SocketIO } from "../../lib/io";
import { toObjectId } from "../../utils/mongo";
import Redis from "ioredis";
import { Queue, QueueScheduler, Job, Worker } from "bullmq";
import { env } from "../../lib/env";
import { redis } from "../../lib/redis";
import * as Sentry from "@sentry/node";

interface Poll {
  _id: string;
  expires_at: Date;
}

export class PollQueue {
  private readonly _redis: Redis;

  public name = "poll";

  private readonly _queue: Queue;

  private readonly _io: SocketIO;

  constructor(io: SocketIO) {
    this._redis = redis;

    this._queue = new Queue(this.name, { connection: this._redis });

    this._io = io;
  }

  get queue(): Queue {
    return this._queue;
  }

  async add(poll: Poll) {
    await this._queue.add(this.name, poll, {
      removeOnComplete: env.isProduction,
      removeOnFail: false,
      attempts: 6,
      backoff: {
        type: "exponential",
        delay: 3000
      },
      delay: new Date(poll.expires_at).getTime() - new Date().getTime()
    });
  }

  async listen() {
    const scheduler = new QueueScheduler(this.name, {
      connection: this._redis
    });

    await scheduler.waitUntilReady();

    const worker = new Worker(
      this.name,
      async (job: Job<Poll>) => {
        return this.process(job.data);
      },
      {
        connection: this._redis
      }
    );

    await worker.waitUntilReady();

    worker.on("failed", (job, error) => {
      Sentry.captureException(error, (scope) => {
        scope.setExtras({
          ctx: "poll.queue -> worker",
          debug_message: "failed to end poll",
          poll: job.data
        });

        return scope;
      });
    });

    logger.info("poll worker listening".yellow);
  }

  private async process(data: Poll) {
    const { _id, poll } = await deps.poll.end(toObjectId(data._id));

    this._io.get().to(_id.toString()).emit("poll ended", poll);
  }
}
