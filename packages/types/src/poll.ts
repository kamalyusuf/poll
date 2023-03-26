export type PollStatus = "active" | "ended";

export interface CreatePollPayload {
  title: string;
  options: string[];
  expires_at: string;
}

export interface VotePollPayload {
  option_id: string;
}

export interface Option {
  _id: string;
  value: string;
  votes: number;
}

export interface Poll {
  _id: string;
  title: string;
  options: Option[];
  status: PollStatus;
  total_votes: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}
