import { BaseRepository } from "../shared/base.repository";
import { Poll, PollMethods, PollProps } from "./poll.model";

export class PollRepository extends BaseRepository<PollProps, PollMethods> {}

export const pollRepo = new PollRepository(Poll);
