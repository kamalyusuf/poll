import "colors";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import mongoose from "mongoose";
import { env } from "../lib/env";
import { CustomError } from "@kamalyb/errors";
import { logger } from "../lib/logger";

const isWhichErrorType = (e: any) => {
  const isUniqueError = e.kind === "unique";
  const isRequiredError = e.kind === "required";
  const isCastError = (e.message as string).startsWith("Cast");
  const isStrictModeError = e.name === "StrictModeError";
  const isEnumError = e.kind === "enum";

  return {
    isUniqueError,
    isRequiredError,
    isCastError,
    isStrictModeError,
    isEnumError
  };
};

const mongodler = (req: Request, res: Response, error: mongoose.Error) => {
  const e = error as any;
  const Errors = e.errors;

  if (!Errors || _.isEmpty(Errors)) {
    const {
      isUniqueError,
      isRequiredError,
      isCastError,
      isStrictModeError,
      isEnumError
    } = isWhichErrorType(e);

    if (isStrictModeError) {
      logger.log({
        level: "error",
        message: error as any,
        metadata: error,
        dev: true
      });

      return res.status(500).send({
        errors: [
          {
            message: env.isProduction ? "internal server error" : e.message
          }
        ]
      });
    }

    const message = isUniqueError
      ? e.message
      : isCastError
      ? e.kind
        ? `expected ${e.path} to be of type ${e.kind}`
        : "invalid" + " data type"
      : isRequiredError
      ? e.message ?? `${e.path} is required`
      : isEnumError
      ? `expected ${e.path} to be one of ${e.properties?.enumValues?.join(
          ", "
        )}`
      : e.message;

    if (e.path?.startsWith("password")) {
      return res.status(422).send({ errors: [{ message, field: "password" }] });
    }

    return res.status(422).send({ errors: [{ message, field: e.path }] });
  }

  const errors = Object.values(Errors).map((e: any) => {
    const {
      isUniqueError,
      isRequiredError,
      isCastError,
      isStrictModeError,
      isEnumError
    } = isWhichErrorType(e);

    if (isStrictModeError) {
      return env.isProduction
        ? {}
        : {
            message: e.message,
            field: e.path
          };
    }

    const message = isUniqueError
      ? e.message
      : isCastError
      ? e.kind
        ? `expected ${e.path} to be of type ${e.kind}`
        : "invalid data type"
      : isRequiredError
      ? e.message ?? `${e.path} is required`
      : isEnumError
      ? `expected ${e.path} to be one of ${e.properties.enumValues.join(", ")}`
      : e.message;

    if (e.path.startsWith("password")) {
      return {
        message,
        field: "password"
      };
    }

    return {
      message,
      field: e.path
    };
  });

  return res.status(422).send({ errors });
};

export const useGlobalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.log({
    level: "error",
    message: error as any,
    metadata: error,
    dev: true
  });

  if (error instanceof CustomError) {
    return res.status(error.status).send({ errors: error.serialize() });
  }

  if (error instanceof mongoose.Error) {
    return mongodler(req, res, error);
  }

  res.status(500).send({
    errors: [
      {
        message: env.isProduction ? "internal server error" : error.message
      }
    ]
  });
};
