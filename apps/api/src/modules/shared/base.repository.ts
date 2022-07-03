import {
  Model as MongooseModel,
  HydratedDocument,
  Types,
  SaveOptions,
  QueryOptions,
  FilterQuery,
  UpdateQuery,
  PipelineStage
} from "mongoose";
import type { MongooseSchemaProps, Timestamp } from "../../types/types";

export abstract class BaseRepository<
  Props extends Timestamp,
  Methods extends {},
  T = MongooseSchemaProps<Props>
> {
  constructor(protected readonly Model: MongooseModel<Props, {}, Methods>) {}

  build(props: T): HydratedDocument<Props, Methods> {
    return new this.Model(props);
  }

  async createOne(props: T): Promise<HydratedDocument<Props, Methods>> {
    return this.Model.create(props);
  }

  async create(
    docs: T[],
    options?: SaveOptions
  ): Promise<Array<HydratedDocument<Props, Methods>>> {
    return this.Model.create(docs, options);
  }

  async findById(
    _id: Types.ObjectId,
    options?: QueryOptions
  ): Promise<HydratedDocument<Props, Methods> | null> {
    let query = this.Model.findById(_id);

    if (options) query = query.setOptions(options);

    return query;
  }

  async exists(filter: FilterQuery<Props>): Promise<boolean> {
    const exists = await this.Model.exists(filter);

    return Boolean(exists);
  }

  async findOne(
    filter: FilterQuery<Props>,
    options?: QueryOptions
  ): Promise<HydratedDocument<Props, Methods> | null> {
    let query = this.Model.findOne(filter);

    if (options) query = query.setOptions(options);

    return query;
  }

  async find(
    filter: FilterQuery<Props>,
    options?: QueryOptions
  ): Promise<HydratedDocument<Props, Methods>[]> {
    let query = this.Model.find(filter);

    if (options) query = query.setOptions(options);

    return query;
  }

  async save(
    doc: HydratedDocument<Props, Methods>,
    options?: SaveOptions
  ): Promise<HydratedDocument<Props, Methods>> {
    return doc.save(options);
  }

  async setAndSave(
    doc: HydratedDocument<Props, Methods>,
    props: Partial<T>,
    options?: SaveOptions
  ): Promise<HydratedDocument<Props, Methods>> {
    doc.set(props);

    return doc.save(options);
  }

  async buildAndSave(
    props: T,
    options?: SaveOptions
  ): Promise<HydratedDocument<Props, Methods>> {
    const doc = this.build(props);

    return doc.save(options);
  }

  async updateOne(
    filter: FilterQuery<Props>,
    update: UpdateQuery<Props>,
    options?: QueryOptions<Props>
  ): Promise<void> {
    await this.Model.updateOne(filter, update, options);
  }

  async deleteOne(
    filter: FilterQuery<Props>,
    options?: QueryOptions<Props>
  ): Promise<void> {
    await this.Model.deleteOne(filter, options);
  }

  async aggregate(pipeline: PipelineStage[]): Promise<Props[]> {
    return this.Model.aggregate(pipeline);
  }
}
