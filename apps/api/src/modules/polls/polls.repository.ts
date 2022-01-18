import { BaseRepository } from "../shared/base.repository";
import { Poll, PollDoc, PollProps } from "./poll.model";
import { Model, Document } from "mongoose";

export class PollsRepository extends BaseRepository<PollDoc, PollProps> {
  constructor(model: Model<Document & PollDoc & any>) {
    super(model);
  }
}

export const pollsRepo = new PollsRepository(Poll);
