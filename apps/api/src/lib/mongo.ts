import { retry } from "@lifeomic/attempt";
import { consola } from "consola";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

paginate.paginate.options = {
  customLabels: {
    hasNextPage: "has_next_page",
    hasPrevPage: "has_prev_page",
    nextPage: "next_page",
    prevPage: "prev_page",
    totalDocs: "total_docs",
    totalPages: "total_pages",
    pagingCounter: "paging_counter"
  }
};

mongoose.plugin(paginate);

mongoose.set("sanitizeProjection", true);
mongoose.set("sanitizeFilter", true);
mongoose.set("strict", "throw");
mongoose.set("strictQuery", "throw");

const maxattempts = 5;

const connect = async (url: string) => {
  await retry(
    async () => {
      await mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000
      });

      consola.info(`mongoose connected on ${mongoose.connection.host}`);
    },
    {
      maxAttempts: maxattempts,
      factor: 2,
      jitter: true,
      delay: 200,
      maxDelay: 2000,
      handleError: (error: Error, ctx) => {
        const done = ctx.attemptsRemaining === 0;

        if (done) throw error;
        else
          consola.warn(
            `mongodb connection failed. re-attempting connection. attempt ${
              ctx.attemptNum + 1
            } / ${maxattempts}. [REASON]: ${error.message}`
          );
      }
    }
  );
};

export const mongo = { connect };
