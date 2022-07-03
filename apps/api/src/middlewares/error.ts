import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import mongoose from "mongoose";
import { env } from "../lib/env";
import { ValidationError as JoiValidationErrorType } from "joi";
import { JoiValidationError, CustomError } from "@kamalyb/errors";
import { ErrorProps } from "types";

export const useGlobalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if ((error as any).error && (error as any).error.isJoi) {
    const err: JoiValidationErrorType = (error as any).error;

    const errors = new JoiValidationError(err.details, (error as any).type);

    return res.status(errors.status).send({ errors: errors.serialize() });
  }

  if (error instanceof CustomError)
    return res.status(error.status).send({ errors: error.serialize() });

  const err = mongo(error);
  if (err) return res.status(err.status).send({ errors: err.errors });

  res.status((error as any).status ?? 500).send({
    errors: [
      {
        message: env.isProduction ? "internal server error" : error.message
      }
    ]
  });
};

function mongo(
  error: any
): { errors: ErrorProps[]; status: number } | undefined {
  if (error.name === "ValidationError") {
    const err = error.errors as mongoose.Error.ValidationError;

    const errors = Object.values(err).map(
      (ve: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        const isCastError = ve.name === "CastError";
        const isEnumError = ve.kind === "enum";

        let { message } = ve;

        if (isCastError) message = `expected ${ve.path} to be a ${ve.kind}`;
        else if (isEnumError)
          message = `${ve.path} must be one of [${(
            ve as any
          ).properties.enumValues.join(", ")}]`;

        return {
          message,
          path: ve.path
        };
      }
    );

    return { errors, status: 422 };
  }
}
