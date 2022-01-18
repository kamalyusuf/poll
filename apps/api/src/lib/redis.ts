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
  console.log("redis.error", error);
  process.exit(1);
});
