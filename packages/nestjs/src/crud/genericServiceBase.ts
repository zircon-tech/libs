import { GenericRepositoryBase } from './genericRepositoryBase';

export class GenericServiceBase<T> {
  constructor(protected repository: GenericRepositoryBase<T>) {}

  public create(body: Partial<T>): Promise<T> {
    return this.repository.create(body);
  }

  public find(
    query: Parameters<GenericRepositoryBase<T>['find']>[0] = {},
  ): Promise<T[]> {
    return this.repository.find(query);
  }

  public findOne(
    query: Parameters<GenericRepositoryBase<T>['findOne']>[0] = {},
  ): Promise<T | null> {
    return this.repository.findOne(query);
  }

  public findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  public updateOne(id: string, body: Partial<T & Document>): Promise<T> {
    return this.repository.updateOne(id, body) as Promise<T>;
  }

  public update(
    query: Parameters<GenericRepositoryBase<T>['update']>[0] = {},
    body: Partial<T & Document>,
  ) {
    return this.repository.update(query, body);
  }

  public deleteOne(id: string): Promise<boolean> {
    return this.repository.deleteOne(id);
  }

  public delete(
    query: Parameters<GenericRepositoryBase<T>['delete']>[0] = {},
  ): Promise<boolean> {
    return this.repository.delete(query);
  }
}
