import {
  SchemaOptions,
  SchemaDefinition,
  SchemaDefinitionType,
  Schema,
  Model as MongooseModel,
  model
} from "mongoose";
import type { MongooseSchemaProps } from "../../types/types";

export const buildEntity = <Props, Methods = {}, Statics = {}>() => {
  const createSchema = (
    definition: Required<
      SchemaDefinition<SchemaDefinitionType<MongooseSchemaProps<Props>>>
    >,
    options: Omit<SchemaOptions, "toObject" | "toJSON" | "collection"> & {
      json_exclude_fields?: Array<keyof Props>;
    } = {}
  ): Schema<
    Props,
    MongooseModel<Props, {}, Methods> & Statics,
    Methods,
    {}
  > => {
    const schemaOptions: SchemaOptions = {
      ...options,
      id: false,
      versionKey: false,
      timestamps:
        options.timestamps === false
          ? options.timestamps
          : {
              createdAt: "created_at",
              updatedAt: "updated_at"
            },
      toObject: {
        virtuals: true
      },
      toJSON: {
        virtuals: true,
        transform(_: any, ret: any) {
          if (options.json_exclude_fields) {
            for (const field of options.json_exclude_fields) {
              delete ret[field];
            }
          }
        }
      }
    };

    const schema = new Schema(definition as any, schemaOptions) as any;

    schema.plugin(require("mongoose-unique-validator"), {
      message: "{PATH} already exists"
    });

    return schema;
  };

  const createModel = (
    name: string,
    schema: Schema<Props, MongooseModel<Props, {}, Methods> & Statics>,
    collection: string
  ): MongooseModel<Props, {}, Methods> & Statics =>
    model(name, schema, collection) as any;

  return { schema: createSchema, model: createModel } as const;
};
