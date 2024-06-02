import mongoose from "mongoose";

interface OptionsProps {
  _id: mongoose.Types.ObjectId;
  value: string;
  votes: number;
}

export interface PollProps {
  _id: mongoose.Types.ObjectId;
  title: string;
  options: OptionsProps[];
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type PollDoc = mongoose.HydratedDocument<PollProps & Methods>;

interface Methods {
  expired: () => boolean;
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

const pollschema = new mongoose.Schema<PollProps, object, Methods>(
  {
    title: {
      type: String,
      required: true
    },
    options: {
      type: [optionschema],
      required: true
    },
    expires_at: Date
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

pollschema.method("expired", function () {
  if (!this.expires_at) return false;

  return this.expires_at <= new Date();
});

pollschema.virtual("total_votes").get(function () {
  return this.options.reduce((acc, current) => acc + current.votes, 0);
});

pollschema.virtual("status").get(function () {
  const now = new Date();

  if (!this.expires_at || this.expires_at > now) return "active";

  return "ended";
});

export const Poll = mongoose.model("Poll", pollschema);
