import 'reflect-metadata';
import { GraphQLResolveInfo } from 'graphql';
import { generateError, generateSuccess } from '../../utilities/response_model';
import { UserService } from '../../services/user.service';
import { container } from 'tsyringe';
import { validator } from '../../utilities/pipes/validation.pipe';
import { BadRequestError, CustomError, ServerError } from '../../utilities/errors';
import { extractFields } from '../../utilities/extractFields';
import { User } from '../../entities/user.entity';
import { UserInputRequest, UserUpdateRequest } from '../../models/users.models';
import logger from '../../configs/logger';

const userService = container.resolve(UserService);

const userResolvers = {
  Query: {
    users: () => ({}),
  },
  Mutation: {
    user: () => ({}),
  },
  UserQuery: {
    async list(
      _: any,
      {
        search,
        page,
        limit,
      }: { search?: string; page?: number; limit?: number },
      context: any,
      info: GraphQLResolveInfo
    ) {
      try {
        const fields = extractFields<User>(info);
        return await userService.getAll(fields, search, page, limit);
      } catch (error) {
        return generateError(
          error instanceof CustomError
            ? error
            : new ServerError('An unexpected error occurred.')
        );
      }
    },
    async getOne(_: any, { id }: { id: string }) {
      try {
        return await userService.getById(id);
      } catch (error) {
        return generateError(
          error instanceof CustomError
            ? error
            : new ServerError('An unexpected error occurred.')
        );
      }
    },
  },
  UserMutation: {
    async create(_: any, args: UserInputRequest) {
      try {
        // Validate input
        const { err, errors } = await validator(UserInputRequest, args);
        if (err) throw new BadRequestError('Bad Request', errors);

        const user = await userService.create(args);

        return {
          user,
          responseResult: generateSuccess('User created successfully'),
        };
      } catch (error) {
        return generateError(
          error instanceof CustomError
            ? error
            : new ServerError('An unexpected error occurred.')
        );
      }
    },
    async update(_: any, args: UserUpdateRequest) {
      try {
        // Validate input
        const { err, errors } = await validator(UserUpdateRequest, args);
        if (err) throw new BadRequestError('Bad Request', errors);

        await userService.update(args);

        return {
          responseResult: generateSuccess('User Update successfully'),
        };
      } catch (error) {
        return generateError(
          error instanceof CustomError
            ? error
            : new ServerError('An unexpected error occurred.')
        );
      }
    },
    async delete(_: any, args: { id: string }) {
      try {
        await userService.delete(args.id);

        return {
          responseResult: generateSuccess('User Deleted successfully'),
        };
      } catch (error) {
        return generateError(
          error instanceof CustomError
            ? error
            : new ServerError('An unexpected error occurred.')
        );
      }
    },
  },
};

export default userResolvers;
