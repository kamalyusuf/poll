import type { NextFunction, Request, Response } from "express";
import {
  JoiValidationError,
  CustomError,
  ErrorLocation
} from "@kamalyb/errors";
import { isCelebrateError } from "celebrate";

export const useglobalerrorhandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError)
    return res.status(error.status).send({ errors: error.serialize() });

  if (isCelebrateError(error)) {
    const errors = [];

    for (const [segment, err] of error.details.entries())
      for (const e of new JoiValidationError(
        err.details,
        segment as ErrorLocation
      ).serialize())
        errors.push(e);

    return res.status(422).send({ errors });
  }

  res.status(500).send({
    errors: [
      {
        message: error.message
      }
    ]
  });
};
