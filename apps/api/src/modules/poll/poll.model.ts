import { HydratedDocument } from "mongoose";
import type { MongooseProps } from "../../types/types";
import { buildEntity } from "../shared/utils";
import {
  type Poll as PollType,
  type Option as OptionType,
  PollStatus
} from "types";

export type PollProps = Omit<
  MongooseProps<PollType>,
  "total_votes" | "expires_at"
> & {
  expires_at: Date;
};
export type PollDoc = HydratedDocument<PollProps, PollMethods>;

export type OptionProps = MongooseProps<OptionType>;
export type OptionDoc = HydratedDocument<OptionProps, {}>;

export interface PollMethods {
  isActive: () => boolean;
}

const builder = buildEntity<PollProps, PollMethods, {}>();

const OptionSchema = buildEntity<OptionProps, {}, {}>().schema(
  {
    value: {
      type: String,
      required: [true, "value is required"]
    },
    votes: {
      type: Number,
      required: [true, "votes is required"],
      default: 0
    }
  },
  { timestamps: false }
);

const PollSchema = builder.schema({
  title: {
    type: String,
    required: [true, "title is required"]
  },
  options: {
    type: [OptionSchema],
    required: [true, "options is required"]
  },
  status: {
    type: String,
    required: [true, "status is required"],
    enum: Object.values(PollStatus),
    default: PollStatus.ACTIVE
  },
  expires_at: {
    type: Date,
    required: [true, "expires_at is required"]
  }
});

PollSchema.methods = {
  isActive: function () {
    return this.status === PollStatus.ACTIVE;
  }
};

PollSchema.index({ _id: 1, "options._id": 1, status: 1 });
PollSchema.index({ _id: 1, status: 1 });

export const Poll = builder.model("Poll", PollSchema, "polls");
