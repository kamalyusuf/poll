import type { NextFunction, Request, Response } from "express";
import {
  JoiValidationError,
  CustomError,
  type ErrorSource
} from "@kamalyb/errors";
import { isCelebrateError } from "celebrate";

export const useglobalerrorhandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof CustomError)
    return void res.status(error.status).json({ errors: error.serialize() });

  if (isCelebrateError(error)) {
    const errors = [];

    for (const [source, err] of error.details.entries())
      errors.push(
        ...new JoiValidationError(
          err.details,
          source as ErrorSource
        ).serialize()
      );

    return void res.status(422).json({ errors });
  }

  res.status(500).json({
    errors: [
      {
        message: error.message
      }
    ]
  });
};
