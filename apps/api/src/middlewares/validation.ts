import { ValidatorValidationError } from "@kamalyb/errors";
import { Request, RequestHandler } from "express";
import { body, param, query, validationResult } from "express-validator";
import { MinMaxOptions } from "express-validator/src/options";
import { checkLengthAndGenerateMessage, Length } from "../utils/validation";

const fields = ["body", "query", "params"] as const;

// @ts-ignore
type Field = typeof fields[number];

interface BaseCheckOptions {
  field_name: string;
  optional?: boolean;
  length?: Length;
}

interface CheckStringOptions {
  path: string;
  escape?: boolean;
  length?: Length;
  trim?: boolean;
  field_name?: string;
  message?: string;
  optional?: boolean;
  in?: Readonly<string[]>;
  input_case?: "upper" | "lower" | "default";
  is_alpha?: boolean;
  customs?: Array<{
    fn: (value: string, req: Request) => true;
    message?: string;
  }>;
}

const ratify = (path: string) => {
  const args = path.split(".");

  if (args.length !== 2) {
    throw new Error(
      `
      invalid path.
      example path: 'body|params|query.email'
    `.red
    );
  }

  const [field, field_name] = args;

  if (!fields.includes(field as any)) {
    throw new Error(`expected field to be one of '${fields.join(", ")}'`);
  }

  if (!field_name.trim()) {
    throw new Error("invalid field name");
  }

  let chain;

  switch (field) {
    case "body":
      chain = body(field_name);
      break;
    case "query":
      chain = query(field_name);
      break;
    case "params":
      chain = param(field_name);
      break;
    default:
      throw new Error("we should not get here");
  }

  return {
    field,
    field_name,
    chain
  };
};

export const useCheckEmail = (
  { path, optional }: Pick<CheckStringOptions, "path" | "optional"> = {
    path: "body.email"
  }
) => {
  let { chain } = ratify(path);

  chain = chain
    .exists()
    .withMessage("email is required")
    .bail()
    .not()
    .isEmpty()
    .withMessage("email is required")
    .bail()
    .isString()
    .withMessage("expected email to be of type string")
    .bail()
    .isEmail()
    .withMessage("invalid email")
    .bail()
    .trim()
    .escape()
    .normalizeEmail({ gmail_remove_dots: false });

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

export const useCheckString = ({
  path,
  length,
  trim = true,
  escape,
  field_name: fn,
  message,
  optional = false,
  in: isIn,
  input_case,
  is_alpha,
  customs
}: CheckStringOptions) => {
  let { chain, field_name } = ratify(path);
  const f = fn ?? field_name;
  const m = message ?? `${f} is required`;

  if (input_case && isIn) {
    throw new Error("cannot have fields 'input_case' and 'in'. select one");
  }

  chain = chain
    .exists()
    .withMessage(m)
    .bail()
    .not()
    .isEmpty()
    .withMessage(m)
    .bail()
    .isString()
    .withMessage(`expected ${f} to be of type string`)
    .bail();

  if (is_alpha) {
    chain = chain.isAlpha().withMessage(`invalid ${f}`).bail();
  }

  if (length) {
    const options: MinMaxOptions = {};
    let message = checkLengthAndGenerateMessage({
      field_name: f,
      length,
      options,
      type: "string"
    });

    chain = chain
      .isLength(options)
      .withMessage(length.message || message)
      .bail();
  }

  if (!isIn && escape) {
    chain = chain.escape();
  }

  if (!isIn && trim) {
    chain = chain.trim();
  }

  if (isIn && !input_case) {
    chain = chain
      .isIn(isIn)
      .withMessage(`expected ${f} to be one of '${isIn.join(", ")}'`)
      .bail();
  }

  if (input_case) {
    if (input_case === "lower") {
      chain = chain.toLowerCase();
    } else if (input_case === "upper") {
      chain = chain.toUpperCase();
    }
  }

  if (customs) {
    for (const custom of customs) {
      chain = chain.custom((value, { req }) => {
        return custom.fn(value, req as Request);
      });

      if (custom.message) {
        chain = chain.withMessage(custom.message);
      }

      chain = chain.bail();
    }
  }

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

export const useCheckPassword = ({
  cl = false,
  path = "body.password",
  field_name
}: { cl?: boolean; path?: string; field_name?: string } = {}) => {
  const options: CheckStringOptions = {
    trim: false,
    escape: false,
    path,
    field_name
  };

  if (cl) {
    options.length = {
      min: 8
    };
  }

  return useCheckString(options);
};

export const useIsValidObjectId = ({
  path = "params.id",
  message,
  optional
}: { path?: string; message?: string; optional?: boolean } = {}) => {
  let { chain, field_name } = ratify(path);

  chain = chain
    .exists()
    .withMessage(`${field_name} is required`)
    .bail()
    .not()
    .isEmpty()
    .withMessage(`${field_name} is required`)
    .bail()
    .isMongoId()
    .withMessage(message ?? `expected ${field_name} to be valid object id`);

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

// @ts-ignore
type Type = string | number | boolean;

// @ts-ignore
type TypeOfType<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : never;

export const useCheckArrayOfType = <T extends string | number | boolean>({
  field_name,
  optional,
  length,
  in: isIn,
  type
}: BaseCheckOptions & {
  in?: T extends boolean ? undefined : Readonly<T[]>;
  type: T extends string ? "string" : T extends number ? "number" : "boolean";
}) => {
  let chain = body(`${field_name}`)
    .exists()
    .withMessage(`${field_name} is required`)
    .bail()
    .isArray()
    .withMessage(`expected ${field_name} to be an array`)
    .bail()
    .not()
    .isEmpty()
    .withMessage(`expected ${field_name} to contain element(s) of type ${type}`)
    .bail();

  if (length) {
    const options: MinMaxOptions = {};
    const message = checkLengthAndGenerateMessage({
      field_name,
      length,
      options,
      type: "array"
    });

    chain = chain
      .isArray(options)
      .withMessage(length.message || message)
      .bail();
  }

  chain = chain
    .custom((array: T[]) => {
      let not: boolean = false;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const is = typeof element === type;
        if (!is) {
          not = true;
        }
      }

      return !not;
    })
    .withMessage(`expected values of ${field_name} to be of type ${type}`)
    .bail();

  const isNotBoolean = type === "string" || type === "number";

  if (isNotBoolean && isIn) {
    chain = chain
      .custom((array) => {
        let not: boolean = false;
        for (let i = 0; i < array.length; i++) {
          const element = array[i] as never;
          const includes = isIn.includes(element);
          if (!includes) {
            not = true;
          }
        }
        return !not;
      })
      .withMessage(
        `expected values of ${field_name} to be one of '${isIn.join(", ")}'`
      )
      .bail();
  }

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

export const useCheckArray = ({
  field_name,
  optional,
  length
}: BaseCheckOptions) => {
  let chain = body(`${field_name}`)
    .exists()
    .withMessage(`${field_name} is required`)
    .bail()
    .isArray()
    .withMessage(`expected ${field_name} to be an array`)
    .bail();

  if (length) {
    const options: MinMaxOptions = {};
    const message = checkLengthAndGenerateMessage({
      field_name,
      length,
      options,
      type: "array"
    });

    chain = chain
      .isArray(options)
      .withMessage(length.message || message)
      .bail();
  }

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

export const useCheckInteger = ({
  field_name,
  length,
  optional = false,
  in: isIn
}: BaseCheckOptions & { in?: Readonly<number[]> }) => {
  let chain = body(field_name)
    .exists()
    .withMessage(`${field_name} is required`)
    .bail()
    .isInt()
    .withMessage(`expected ${field_name} to be of type integer`)
    .bail();

  if (length && (length.min || length.max)) {
    const options: MinMaxOptions = {};
    const message = checkLengthAndGenerateMessage({
      field_name,
      length,
      options,
      type: "number"
    });

    chain = chain
      .isInt(options)
      .withMessage(length?.message || message)
      .bail();
  }

  if (isIn) {
    chain = chain
      .isIn(isIn)
      .withMessage(`expected ${field_name} to be one of ${isIn.join(", ")}`)
      .bail();
  }

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

export const useCheckBoolean = ({
  field_name,
  optional = false
}: Omit<BaseCheckOptions, "length">) => {
  let chain = body(field_name)
    .exists()
    .withMessage(`${field_name} is required`)
    .bail()
    .isBoolean({ strict: true })
    .withMessage(`expected ${field_name} to be a boolean`)
    .bail();

  if (optional) {
    chain = chain.optional({ nullable: true, checkFalsy: false });
  }

  return chain;
};

export const useCheckValidationResult: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidatorValidationError(errors.array());
  }

  next();
};
