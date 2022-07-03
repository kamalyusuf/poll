import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis.on("connect", () => {
  logger.info("redis connected".magenta);
});

redis.on("error", (error) => {
  logger.error(`failed to connect to redis. reason: ${error.message}`);

  process.exit(1);
});
