import mongoose from "mongoose";

export const isMongooseDocument = (doc: any) => {
  return doc instanceof mongoose.Document;
};
