import { fieldsList } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { FindOptionsSelect } from 'typeorm';

/**
 * Interface representing the structure of extracted GraphQL fields.
 */
export interface ExtractedFields<T> {
  fields: (keyof T)[];
}

/**
 * Extract the requested fields from a GraphQL query.
 * @param info - GraphQLResolveInfo from the resolver
 * @returns An object containing an array of requested field names
 */
export const extractFields = <T>(
  info: GraphQLResolveInfo
): ExtractedFields<T> => {
  return { fields: fieldsList(info, { path: 'data' }) as (keyof T)[] };
};

/**
 * Convert an array of field names into a TypeORM `FindOptionsSelect` object.
 * @param fields - Array of field names to be selected.
 * @returns TypeORM FindOptionsSelect object.
 */
export const buildSelectFields = <T>(
  fields: (keyof T)[]
): FindOptionsSelect<T> => {
  return Object.fromEntries(
    fields.map((field) => [field, true])
  ) as FindOptionsSelect<T>;
};
