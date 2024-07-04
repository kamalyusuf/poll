import type { NextFunction, Request, Response } from "express";
import { JoiValidationError, CustomError } from "@kamalyb/errors";
import { isCelebrateError } from "celebrate";

export const useglobalerrorhandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError)
    return res.status(error.status).json({ errors: error.serialize() });

  if (isCelebrateError(error)) {
    const errors = [];

    for (const [, err] of error.details.entries())
      for (const e of new JoiValidationError(err.details).serialize())
        errors.push(e);

    return res.status(422).json({ errors });
  }

  return res.status(500).json({
    errors: [
      {
        message: error.message
      }
    ]
  });
};
