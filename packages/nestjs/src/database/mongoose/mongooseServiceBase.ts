import { Document, PipelineStage } from 'mongoose';
import { MongooseRepositoryBase } from './mongooseRepositoryBase';
import { GenericFilterDTO } from '@src/dtos/genericFilterDTO';
import { $limit, $skip, $sort } from '@src/database/mongoose/aggregations';

export class MongooseServiceBase<T> {
  constructor(protected repository: MongooseRepositoryBase<T>) {}

  public create(body: Partial<T>): Promise<T> {
    return this.repository.create(body);
  }

  public createMany(body: Partial<T>[]): Promise<T[]> {
    return this.repository.bulkCreate(body);
  }

  public count(
    query: Parameters<MongooseRepositoryBase<T>['count']>[0] = {},
  ): Promise<number> {
    return this.repository.count(query);
  }

  public find(
    query: Parameters<MongooseRepositoryBase<T>['find']>[0] = {},
  ): Promise<T[]> {
    return this.repository.find(query);
  }

  public findSorted(
    query: Parameters<MongooseRepositoryBase<T>['findSorted']>[0] = {},
    sort: Parameters<MongooseRepositoryBase<T>['findSorted']>[1] = {},
  ): Promise<T[]> {
    return this.repository.findSorted(query, sort);
  }

  public findOne(
    query: Parameters<MongooseRepositoryBase<T>['findOne']>[0] = {},
  ): Promise<T | null> {
    return this.repository.findOne(query);
  }

  public findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  public aggregate<R = any>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.repository.aggregate(pipeline);
  }

  public updateOne(id: string, body: Partial<T & Document>): Promise<T> {
    return this.repository.updateOne(id, body) as Promise<T>;
  }

  public update(
    query: Parameters<MongooseRepositoryBase<T>['update']>[0] = {},
    body: Partial<T & Document>,
  ) {
    return this.repository.update(query, body);
  }

  public deleteOne(id: string): Promise<boolean> {
    return this.repository.deleteOne(id);
  }

  public _filter(
    filter: GenericFilterDTO<T>,
    searchPipeline = [] as PipelineStage[],
    filterPipeline: PipelineStage[],
  ) {
    const commonFiltersPipeline = [
      filter.sortBy && $sort(filter.sortBy, filter.sortOrder === 'asc'),
      filter.skip && $skip(filter.skip),
      filter.limit && $limit(filter.limit),
    ].filter(Boolean);

    return this.repository.aggregate([
      ...searchPipeline.filter(Boolean),
      ...filterPipeline.filter(Boolean),
      ...commonFiltersPipeline,
    ] as PipelineStage[]);
  }
}
