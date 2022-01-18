import { MinMaxOptions } from "express-validator/src/options";

export type Length = MinMaxOptions & { message?: string };

export const checkLengthAndGenerateMessage = ({
  field_name,
  length,
  options,
  type
}: {
  field_name: string;
  length: Length;
  options: MinMaxOptions;
  type: "string" | "number" | "array";
}) => {
  let message: string;
  const isString = type === "string";
  const isArray = type === "array";

  if (length.min) {
    options.min = length.min;
  }
  if (length.max) {
    options.max = length.max;
  }

  if (options.min && options.max) {
    const m = `expected ${field_name} to be between ${options.min} and ${
      options.max
    } ${isString ? "characters" : ""}`;

    const am = `expected ${field_name} to contain min ${options.min} and max ${options.max} values`;

    message = isArray ? am : m;
  } else if (options.min && !options.max) {
    const m = `expected ${field_name} to be >= ${options.min} ${
      isString ? "characters" : ""
    }`;

    const am = `expected ${field_name} to contain min ${options.min} values`;

    message = isArray ? am : m;
  } else {
    const m = `expected ${field_name} to be <= ${options.max} 
    ${isString ? "characters" : ""}`;

    const am = `expected ${field_name} to contain max ${options.max} values`;

    message = isArray ? am : m;
  }

  return message.trim();
};
