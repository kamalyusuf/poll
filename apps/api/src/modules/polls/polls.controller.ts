import { RequestHandler } from "express";
import { CreatePollPayload, VotePollPayload } from "types";
import { pollsService } from "./polls.service";
import { Types } from "mongoose";

export const Create: RequestHandler = async (req, res) => {
  const payload: CreatePollPayload = req.body;

  const poll = await pollsService.create(payload);

  res.status(201).send(poll);
};

export const Vote: RequestHandler = async (req, res) => {
  const payload: VotePollPayload = req.body;

  const poll = await pollsService.findById(new Types.ObjectId(req.params.id));

  const updated = await pollsService.vote(poll, payload);

  res.send(updated);
};

export const GetById: RequestHandler = async (req, res) => {
  const poll = await pollsService.findByIdWithTotalVotes(
    new Types.ObjectId(req.params.id)
  );

  res.send(poll);
};
