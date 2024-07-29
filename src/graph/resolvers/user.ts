import { GraphQLResolveInfo } from 'graphql';
import { generateSuccess } from '../../helper/graph';

const userResolvers = {
  Query: {
    async users() {
      return {};
    },
  },
  Mutation: {
    async users() {
      return {};
    },
  },
  UserQuery: {
    async list() {
      return {}
    }
  },
  UserMutation: {
    async create(
      parent: any,
      args: { email: string; name: string; passwordRaw?: string },
      context: any,
      info: GraphQLResolveInfo
    ) {
      return generateSuccess('User created successfully')
    },
  },
};

export default userResolvers;
