import mongoose from "mongoose";
import { PollStatus } from "types";

interface OptionsProps {
  _id: mongoose.Types.ObjectId;
  value: string;
  votes: number;
}

export interface PollProps {
  _id: mongoose.Types.ObjectId;
  title: string;
  options: OptionsProps[];
  status: PollStatus;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export type PollDoc = mongoose.HydratedDocument<PollProps & Methods>;

interface Methods {
  isactive: () => boolean;
}

const optionschema = new mongoose.Schema<OptionsProps>(
  {
    value: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: false, id: false, versionKey: false }
);

const pollschema = new mongoose.Schema<PollProps, {}, Methods>(
  {
    title: {
      type: String,
      required: true
    },
    options: {
      type: [optionschema],
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "ended"],
      default: "active"
    },
    expires_at: {
      type: Date,
      required: true
    }
  },
  {
    id: false,
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "polls",
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

pollschema.method("isactive", function () {
  const poll = this as PollDoc;

  return poll.status === "active";
});

pollschema.virtual("total_votes").get(function () {
  return this.options.reduce((acc, current) => acc + current.votes, 0);
});

export const Poll = mongoose.model("Poll", pollschema);
