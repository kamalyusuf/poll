import mongoose from "mongoose";

interface PollVoteProps {
  _id: mongoose.Types.ObjectId;
  poll_id: mongoose.Types.ObjectId;
  vid: string;
}

const schema = new mongoose.Schema<PollVoteProps>(
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
    collection: "poll_votes"
  }
);

schema.index({ poll_id: 1, vid: 1 }, { unique: true });

export const PollVote = mongoose.model("PollVote", schema);
