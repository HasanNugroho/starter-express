import { User } from '../entities/user.entity';
import { inject, injectable } from 'tsyringe';
import { BadRequestError, NotAuthorized, NotFoundException } from '../utilities/errors';
import { UserInputRequest, UserUpdateRequest } from '../models/users.models';
import { UserRepository } from '../repositories/users.repo';
import { LoginRequest } from '../models/auth.models';
import { ComparePassword, HashPassword } from '../utilities/security';
import { GenerateToken } from '../utilities/jwt';

@injectable()
export class AuthService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  async register(input: UserInputRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser)
      throw new BadRequestError('User with email already exists.');

    input.password = await HashPassword(input.password)

    return await this.userRepository.create(input);
  }

  async login(input: LoginRequest) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (!existingUser)
      throw new NotAuthorized('Email / password not match.');

    const isPasswordValid = await ComparePassword(input.password, existingUser.password);
    if (!isPasswordValid)
      throw new NotAuthorized('Email / password not match.');

    const token = GenerateToken({ id: existingUser.id, email: existingUser.email, name: existingUser.name });

    return {
      ...existingUser,
      token,
    }
  }


}
