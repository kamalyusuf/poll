import mongoose from "mongoose";

interface VoteProps {
  _id: mongoose.Types.ObjectId;
  poll_id: mongoose.Types.ObjectId;
  vid: string;
}

const schema = new mongoose.Schema<VoteProps>(
  {
    poll_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Poll"
    },
    vid: {
      type: String,
      required: true
    }
  },
  {
    id: false,
    versionKey: false,
    timestamps: false,
    collection: "votes"
  }
);

schema.index({ poll_id: 1, vid: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", schema);
