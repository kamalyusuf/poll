export type MongooseProps<Props> = Omit<
  Props,
  "_id" | "created_at" | "updated_at"
> &
  Timestamp;

export interface Timestamp {
  created_at: Date;
  updated_at: Date;
}

export type MongooseSchemaProps<T> = Omit<
  T,
  "_id" | "created_at" | "updated_at"
>;
