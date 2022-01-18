import {
  createSchema,
  Type,
  typedModel,
  ExtractProps,
  ExtractDoc
} from "ts-mongoose";
import { createSchemaOptions } from "../shared/utils";
import { POLL_STATUSES, PollStatus } from "types";

export type OptionDoc = ExtractDoc<typeof OptionSchema>;
export type OptionProps = ExtractProps<typeof OptionSchema>;

export type PollDoc = ExtractDoc<typeof PollSchema>;
export type PollProps = ExtractProps<typeof PollSchema>;

const OptionSchema = createSchema(
  {
    value: Type.string({ required: true }),
    votes: Type.number({ required: true, default: 0 })
  },
  createSchemaOptions({ timestamps: false })
);

const PollSchema = createSchema(
  {
    title: Type.string({ required: true }),
    options: Type.array({ required: true }).of(OptionSchema),
    status: Type.string({
      required: true,
      enum: POLL_STATUSES,
      default: PollStatus.ACTIVE
    }),
    expires_at: Type.date({ required: true })
  },
  createSchemaOptions({ collection: "polls" })
);

PollSchema.index({ _id: 1, "options._id": 1, status: 1 });
PollSchema.index({ _id: 1, status: 1 });

export const Poll = typedModel("Poll", PollSchema);
