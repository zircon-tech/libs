import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

/**
 * Represents a generic filter DTO.
 * @template T - The type of the DTO.
 */
export class GenericFilterDTO<T> {
  /**
   * The number of items to skip.
   * @type {number}
   */
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  skip?: number;

  /**
   * The maximum number of items to return.
   * @type {number}
   */
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number;

  /**
   * The property to sort by.
   * @type {keyof T}
   */
  @IsOptional()
  sortBy?: keyof T;

  /**
   * The sort order ('asc' or 'desc').
   * @type {'asc' | 'desc'}
   */
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
