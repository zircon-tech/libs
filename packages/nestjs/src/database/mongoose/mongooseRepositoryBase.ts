import {
  FilterQuery,
  Model,
  Document,
  PipelineStage,
  SortOrder,
  UpdateQuery,
} from 'mongoose';
import { handleMongooseError } from './exceptions';
import { GenericRepositoryBase } from '../../crud/genericRepositoryBase';

export class MongooseRepositoryBase<T> extends GenericRepositoryBase<T> {
  constructor(protected model: Model<T & Document>) {
    super();
  }

  public create(body: Partial<T>) {
    return this.model.create(body).catch(handleMongooseError);
  }

  public bulkCreate(body: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(body) as Promise<T[]>;
  }

  public async count(query: FilterQuery<T & Document> = {}) {
    return this.model.countDocuments(query);
  }

  public async find(query: FilterQuery<T & Document> = {}) {
    return this.model.find(query).lean();
  }

  public async findSorted(
    query: FilterQuery<T & Document>,
    sort: { [K in keyof T]?: SortOrder } | [string, SortOrder][],
  ) {
    return this.model
      .find(query)
      .sort(sort as any)
      .lean();
  }

  public async findOne(query: FilterQuery<T & Document> = {}) {
    return this.model.findOne(query).lean();
  }

  public async findById(id: string) {
    return this.model.findOne({ id }).lean();
  }

  public async updateOne(id: string, body: UpdateQuery<T & Document>) {
    return this.model.findOneAndUpdate({ id }, body, { new: true }).lean();
  }

  public async update(
    query: FilterQuery<T & Document>,
    body: UpdateQuery<T & Document>,
  ) {
    return Boolean(await this.model.updateMany(query, body));
  }

  public async deleteOne(id: string) {
    return Boolean(await this.model.findOneAndDelete({ id }));
  }

  public async delete(query: FilterQuery<T & Document>) {
    return Boolean(await this.model.deleteMany(query));
  }

  public async aggregate(pipeline: PipelineStage[]) {
    return await this.model.aggregate(pipeline);
  }
}
