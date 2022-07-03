import mongoose from "mongoose";
import { retry } from "@lifeomic/attempt";
import uniqueValidator from "mongoose-unique-validator";
import { logger } from "./logger";

mongoose.set("strict", "throw");
mongoose.set("strictQuery", "throw");
mongoose.set("sanitizeProjection", true);
mongoose.set("sanitizeFilter", true);
mongoose.SchemaTypes.String.cast(false);
mongoose.SchemaTypes.Number.cast(false);
mongoose.SchemaTypes.Boolean.cast(false);

export const connect = async (url: string) => {
  await retry(
    async () => {
      await mongoose.connect(url);

      logger.info(`mongo connected on '${mongoose.connection.host}'`.cyan);
    },
    {
      maxAttempts: 10,
      factor: 2,
      jitter: true,
      maxDelay: 2000,
      handleError: (error, _ctx) => {
        throw new Error(
          `failed to connect to mongodb. reason: ${error.message}`
        );
      }
    }
  );
};
