import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
  Types,
  PipelineStage,
  UpdateQuery
} from "mongoose";

export abstract class BaseRepository<
  Doc extends Document,
  P extends Record<string, any>,
  Props = Omit<P, "_id" | "__v" | "created_at" | "updated_at">,
  OP = P
> {
  constructor(protected readonly model: Model<Document & Doc & any>) {}

  build(props: Partial<Props>) {
    return new this.model(props as any) as Doc;
  }

  async createOne(props: Partial<Props>): Promise<Doc> {
    return this.model.create(props);
  }

  async create(docs: Partial<Props>[], options?: SaveOptions): Promise<Doc[]> {
    return this.model.create(docs, options);
  }

  async findById(
    id: Types.ObjectId,
    options: QueryOptions = {}
  ): Promise<Doc | null> {
    return this.model.findById(id).setOptions(options);
  }

  async exists(filter: FilterQuery<Doc>) {
    return this.model.exists(filter);
  }

  async findOne(
    filter: FilterQuery<Doc>,
    options: QueryOptions = {}
  ): Promise<Doc | null> {
    return this.model.findOne(filter).setOptions(options);
  }

  async find(
    filter: FilterQuery<Doc>,
    options: QueryOptions = {}
  ): Promise<Doc[]> {
    return this.model.find(filter).setOptions(options);
  }

  async save(doc: Doc, options?: SaveOptions) {
    return doc.save(options);
  }

  async setAndSave(doc: Doc, props: Partial<Props>, options?: SaveOptions) {
    doc.set(props);
    return doc.save(options);
  }

  async buildAndSave(props: Partial<Props>, options?: SaveOptions) {
    const doc = this.build(props);

    return doc.save(options);
  }

  async aggregate(pipeline: PipelineStage[]): Promise<Doc[]> {
    return this.model.aggregate(pipeline);
  }

  async updateOne(filter: FilterQuery<Doc>, update: UpdateQuery<Doc>) {
    await this.model.updateOne(filter, update);
  }
}
