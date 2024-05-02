export abstract class GenericRepositoryBase<T> {
  abstract create(body: Partial<T>): Promise<T>;
  abstract find(query: Record<string, unknown>): Promise<T[]>;
  abstract findOne(query: Record<string, unknown>): Promise<T | null>;
  abstract findById(id: unknown): Promise<T | null>;
  abstract updateOne(id: unknown, body: Record<string, unknown>): Promise<T>;
  abstract update(
    query: Record<string, unknown>,
    body: Record<string, unknown>,
  ): Promise<unknown>;

  abstract deleteOne(id: unknown): Promise<boolean>;
  abstract delete(query: Record<string, unknown>): Promise<boolean>;
}
