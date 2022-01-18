import { SchemaOptions } from "mongoose";

export const createSchemaOptions = ({
  json_exclude_fields,
  virtuals = true,
  ...options
}: {
  json_exclude_fields?: string[];
  virtuals?: boolean;
} & SchemaOptions = {}): SchemaOptions => {
  return {
    id: false,
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toJSON: {
      virtuals,
      transform(_: any, ret: any) {
        if (json_exclude_fields) {
          for (const field of json_exclude_fields) {
            delete ret[field];
          }
        }
      }
    },
    toObject: {
      virtuals
    },
    ...options
  };
};
