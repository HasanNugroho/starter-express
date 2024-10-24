import 'reflect-metadata';
import { GraphQLResolveInfo } from 'graphql';
import { generateError, generateSuccess } from '../../helper/graph';
import { UserService } from '../../services/user.service';
import { container } from 'tsyringe';
import { validator } from '../../common/pipes/validation.pipe';
import { UserMinimalDTO } from '../../dto/users.dto';
import { BadRequestError, CustomError, ServerError } from '../../helper/errors';
import { fieldsList, fieldsMap } from 'graphql-fields-list';
import { User } from '../../entities/user.entity';

const userService = container.resolve(UserService);

const userResolvers = {
  Query: {
    users: () => {
      return {};
    },
  },
  Mutation: {
    user: () => {
      return {};
    },
  },
  UserQuery: {
    async list(
      _: any,
      args: { search?: string, page?: number, limit?: number },
      context: any,
      info: GraphQLResolveInfo
    ) {
      try {
        const input = args;
        const fields = fieldsList(info, { path: 'data' }) as (keyof User)[];

        const users = await userService.getAll(fields, input.search, input.page, input.limit);

        return users
      } catch (error) {
        if (error instanceof CustomError) {
          return generateError(error);
        } else {
          return generateError(
            new ServerError('An unexpected error occurred.')
          );
        }
      }
    },
  },
  UserMutation: {
    async create(
      _: any,
      args: { email: string; name: string; password: string },
      context: any,
      info: GraphQLResolveInfo
    ) {
      try {
        const input = args;

        // Validate input using DTO
        const { err, errors } = await validator(UserMinimalDTO, input);

        if (err) throw new BadRequestError('Bad Request', errors);

        const user = await userService.create(input);

        return {
          user,
          responseResult: generateSuccess('User created successfully')
        };
      } catch (error) {
        if (error instanceof CustomError) {
          return generateError(error);
        } else {
          return generateError(
            new ServerError('An unexpected error occurred.')
          );
        }
      }
    },
  },
};

export default userResolvers;
