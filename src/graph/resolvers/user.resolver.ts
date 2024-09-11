import 'reflect-metadata';
import { GraphQLResolveInfo } from 'graphql';
import { generateError, generateSuccess } from '../../helper/graph';
import { UserService } from '../../services/user.service';
import { container } from 'tsyringe';
import { validationPipe } from '../../common/pipes/validation.pipe';
import { UserMinimalDTO } from '../../dto/users.dto';
import { BadRequestError, CustomError, ServerError } from '../../helper/errors';

const userService = container.resolve(UserService);

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
      return {};
    },
  },
  UserMutation: {
    async create(
      args: { input: { name: string; email: string; password: string } },
      context: any
    ) {
      try {
        const { input } = args;
        const { err, errors } = await validationPipe(UserMinimalDTO, input, [
          'initial',
          'typecast',
        ]);
        if (err) {
          throw new BadRequestError('Bad Request', errors);
        }
        await userService.create(input);
        return generateSuccess('User created successfully');
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
