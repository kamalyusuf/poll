export enum PollStatus {
  ACTIVE = "active",
  ENDED = "ended"
}

export const POLL_STATUSES = Object.values(PollStatus) as Readonly<
  PollStatus[]
>;

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
  created_at: string;
  updated_at: string;
  total_votes: number;
  expires_at: string;
}
