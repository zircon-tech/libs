import { PipelineStage } from 'mongoose';
import { Arrays } from '@zircontech/utils';

export const $match = <T = any>(
  $match: Partial<Record<keyof T, any>>,
): PipelineStage.Match => ({
  $match,
});

export const $unwind = (
  field: string,
  preserveNullAndEmptyArrays = true,
): PipelineStage.Unwind => ({
  $unwind: {
    path: `$${field}`,
    preserveNullAndEmptyArrays,
  },
});

/**
 * condition param must follow the mongoose convention:
 * https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/
 */
export const $addFields = (
  fields: { name: string; path?: string; condition?: Record<string, any> }[],
): PipelineStage.AddFields => ({
  $addFields: Arrays.reduceIgnoringNullish(
    fields.map(field => ({
      [field.name]: field.condition ?? `$${field.path}`,
    })),
  ),
});

export const $project = <T = any>(
  fields: (keyof T)[] | Record<string, 1 | 0 | string>,
  include = true,
): PipelineStage.Project => ({
  $project: Array.isArray(fields)
    ? Arrays.reduceIgnoringNullish(
        fields.map(field => ({
          [field]: include ? 1 : -1,
        })),
      )
    : fields,
});

export const $lookup = <T = any, R = any>(
  from: string,
  localField: keyof T,
  as: string,
  foreignField: keyof R,
  pipeline?: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[],
): PipelineStage.Lookup => ({
  $lookup: {
    from,
    localField: localField as string,
    as,
    foreignField: foreignField as string,
    pipeline: pipeline ?? [],
  },
});

export const $search = <T = any>(
  index: string,
  path: keyof T,
  query: string,
  operator: 'autocomplete' | 'text',
): PipelineStage.Search => ({
  $search: {
    index,
    [operator]: {
      path,
      query,
    },
  },
});

export const $compoundSearch = <T = any>(
  index: string,
  term: CompoundTerm,
  queries: {
    operator: 'autocomplete' | 'text';
    path: keyof T;
    query: string;
  }[] = [],
): PipelineStage.Search => ({
  $search: {
    index,
    ...$compound(
      term,
      queries.map(q => ({
        [q.operator]: {
          path: q.path,
          query: q.query,
        },
      })),
    ),
  },
});

export const $sort = <T = any>(
  field: keyof T | (keyof T)[],
  asc = true,
): PipelineStage.Sort => ({
  $sort: Array.isArray(field)
    ? field.reduce((acc: Record<string, any>, curr) => {
        acc[curr as string] = asc ? 1 : -1;
        return acc;
      }, {})
    : {
        [field as string]: asc ? 1 : -1,
      },
});

export const $skip = (skip: number): PipelineStage.Skip => ({
  $skip: skip,
});

export const $limit = (limit: number): PipelineStage.Limit => ({
  $limit: limit,
});

type Operator =
  | '$sum'
  | '$avg'
  | '$first'
  | '$last'
  | '$max'
  | '$min'
  | '$push'
  | '$addToSet';

type AggregateField<T> = {
  [K in keyof T & string as `$${K}`]?: T[K];
};

export const $group = <T>(
  groupField: AggregateField<T> = {} as AggregateField<T>,
  accumulators: Record<string, Partial<Record<Operator, string>>> = {},
): PipelineStage.Group => ({
  $group: {
    _id: groupField,
    ...accumulators,
  },
});

type CompoundTerm = 'should' | 'must' | 'mustNot';

/**
 * Create compound aggregation
 * @param term - CompoundTerm to use in the aggregation (should, must, mustNot)
 * @param queries - queries to use in the aggregation
 * @param minMatch - minimum number of queries clauses that must match to include a document
 * @returns aggregation object
 */
export const $compound = (term: CompoundTerm, queries: any[], minMatch = 1) => {
  return {
    compound: {
      [term]: [...queries],
      minimumShouldMatch: minMatch,
    },
  };
};

export const $facet = (
  facets: Record<string, PipelineStage.FacetPipelineStage[]>,
): PipelineStage.Facet => ({
  $facet: facets,
});

/**
 * near: The point to search near.
 * distanceField: The calculated distance.
 * maxDistance: The maximum distance, in meters, documents can be before being excluded from results.
 * query: Limits results that match the query
 * includeLocs: Optional. Labels and includes the point used to match the document.
 * num: Optional. The maximum number of documents to return.
 * spherical: Defaults to false. Specifies whether to use spherical geometry.
 */
export const $geoNear = (
  coordinates: [number, number],
  maxDistance: number,
  query?: Record<string, any>,
): PipelineStage.GeoNear => ({
  $geoNear: {
    near: {
      type: 'Point',
      coordinates,
    },
    maxDistance: maxDistance,
    distanceField: '_distance',
    query,
  },
});
