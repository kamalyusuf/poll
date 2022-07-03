import mongoose from "mongoose";

export const isMongooseDoc = (doc: object) => doc instanceof mongoose.Document;

export const isValidObjectId = (str: string) =>
  mongoose.Types.ObjectId.isValid(str);

export const toObjectId = (str: string): mongoose.Types.ObjectId => {
  if (!isValidObjectId(str)) throw new Error("invalid id");

  return new mongoose.Types.ObjectId(str);
};
