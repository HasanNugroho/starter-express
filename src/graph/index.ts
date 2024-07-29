import path from 'path';
import fs from 'fs';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

// Define your directories
const schemaDir = path.join(__dirname, './schema');
const resolversDir = path.join(__dirname, 'resolvers');

// Load type definitions
const typesArray = loadFilesSync(schemaDir, { extensions: ['graphql'] });

// Load resolvers
const resolversArray = loadFilesSync(resolversDir, {
  extensions: ['ts', 'js'],
});

const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { typeDefs, resolvers, schema };
