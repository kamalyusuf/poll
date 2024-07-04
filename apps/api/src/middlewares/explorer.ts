import type { Express } from "express";
import mongoose from "mongoose";
import { MongooseExplorer } from "mongoose-explore";
import { Vote } from "../poll/vote.model.js";
import type { PollProps } from "../poll/poll.model.js";
import { env } from "../lib/env.js";
import { simplepass } from "../lib/simple-pass.js";

export const useexplorer = (app: Express): void => {
  const explorer = new MongooseExplorer({
    mongoose,
    rootpath: "/explorer",
    resources: {
      Poll: {
        cascade_delete: [
          {
            model: Vote,
            relation: { local_field: "_id", foreign_field: "poll_id" }
          }
        ],
        virtuals: {
          votes: (poll: PollProps) =>
            poll.options
              .reduce((total, option) => total + option.votes, 0)
              .toString(),

          web: (poll: PollProps) =>
            `<a href="${env.WEB_URL.split(",").at(0)}/${poll._id.toString()}/r" target="_blank" rel="noopener noreferrer">view</a>`
        }
      }
    }
  });

  app.use(
    explorer.rootpath,
    simplepass.usepass.bind(simplepass),
    explorer.router()
  );
};
