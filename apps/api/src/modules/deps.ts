import { PollQueue } from "./poll/poll.queue";
import { PollService } from "./poll/poll.service";
import { io } from "../lib/io";
import { pollRepo } from "./poll/poll.repository";

interface Deps {
  queue: {
    poll: PollQueue;
  };
  poll: PollService;
}

declare global {
  var deps: Deps;
}

const deps: Deps = {
  queue: {
    poll: new PollQueue(io)
  },
  poll: new PollService(pollRepo)
};

global.deps = deps;
