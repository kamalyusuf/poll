import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";

export type RouteValidation<T extends string> = Record<
  T,
  Array<ValidationChain | RequestHandler>
>;
