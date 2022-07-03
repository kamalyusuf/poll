import ejv from "express-joi-validation";
import Joi, { SchemaMap } from "joi";

interface Options {
  required?: boolean;
}

export const validator = ejv.createValidator({
  joi: {
    allowUnknown: false,
    presence: "required",
    abortEarly: false,
    errors: {
      wrap: {
        label: false
      }
    }
  },
  passError: true
});

const object = <T>(map: SchemaMap<T, true>) => Joi.object<T, "true">(map);

const string = ({ required = true }: Options = {}) => {
  let schema = Joi.string();

  if (required) schema = schema.required();

  return schema;
};

const array = ({ required = true }: Options = {}) => {
  let schema = Joi.array();

  if (required) schema = schema.required();

  return schema;
};

export const s = {
  object,
  string,
  array
} as const;
