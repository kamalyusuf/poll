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

          open: (poll: PollProps) =>
            `<a href="${env.WEB_URL.split(",").at(0)}/${poll._id.toString()}/r" target="_blank" rel="noopener noreferrer">open</a>`
        },
        bulk_delete: {
          enabled: false
        }
      },
      Vote: {
        editable: false,
        deletable: false,
        creatable: false,
        bulk_delete: {
          enabled: false
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
