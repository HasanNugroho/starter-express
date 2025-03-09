import 'reflect-metadata';
import { generateError, generateSuccess } from '../../utilities/response_model';
import { container } from 'tsyringe';
import { validator } from '../../utilities/pipes/validation.pipe';
import { BadRequestError, CustomError, ServerError } from '../../utilities/errors';
import { UserInputRequest } from '../../models/users.models';
import { LoginRequest } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';

const authService = container.resolve(AuthService);

const authResolvers = {
  Mutation: {
    auths: () => ({}),
  },
  AuthMutation: {
    async register(_: any, args: UserInputRequest) {
      try {
        // Validate input
        const { err, errors } = await validator(UserInputRequest, args);
        if (err) throw new BadRequestError('Bad Request', errors);

        const data = await authService.register(args);

        return {
          data: {
            ...data,
            token: ""
          },
          responseResult: generateSuccess('Auth registered successfully'),
        };
      } catch (error) {
        return generateError(
          error instanceof CustomError
            ? error
            : new ServerError('An unexpected error occurred.')
        );
      }
    },
    async login(_: any, args: LoginRequest) {
      try {
        // Validate input
        const { err, errors } = await validator(LoginRequest, args);
        if (err) throw new BadRequestError('Bad Request', errors);

        const data = await authService.login(args);

        return {
          data,
          responseResult: generateSuccess('Login successfully'),
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

export default authResolvers;
