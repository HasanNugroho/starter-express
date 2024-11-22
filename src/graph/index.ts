import path from 'path';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { rateLimitDirective } from 'graphql-rate-limit-directive';

// Destructure to get the type definitions and transformer
const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

// Define your directories
const schemaDir = path.join(__dirname, './schema');
const resolversDir = path.join(__dirname, '/resolvers');

// Load type definitions
const typesArray = loadFilesSync(schemaDir, { extensions: ['graphql'] });

// Load resolvers
const resolversArray = loadFilesSync(resolversDir, {
  extensions: ['ts', 'js'],
});

const typeDefs = mergeTypeDefs([
  rateLimitDirectiveTypeDefs,  // Add rate limit directive type definitions
  ...typesArray,               // Spread custom types
]);

const resolvers = mergeResolvers(resolversArray);

let schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
schema = rateLimitDirectiveTransformer(schema);


export default schema 
