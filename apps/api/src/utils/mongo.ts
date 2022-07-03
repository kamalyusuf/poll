import mongoose, { Types } from "mongoose";

export const isMongooseDoc = (doc: object) => doc instanceof mongoose.Document;

export const isValidObjectId = (str: string) => Types.ObjectId.isValid(str);

export const toObjectId = (str: string): Types.ObjectId => {
  if (!isValidObjectId(str)) throw new Error("invalid id");

  return new Types.ObjectId(str);
};
