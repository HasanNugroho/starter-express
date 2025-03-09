import { User } from '../entities/user.entity';
import { inject, injectable } from 'tsyringe';
import { BadRequestError, NotFoundException } from '../common/errors';
import { generatePagination } from '../common/pagination';
import { ExtractedFields } from '../common/extractFields';
import { UserInputRequest, UserUpdateRequest } from '../models/users.models';
import { UserRepository } from '../repositories/users.repo';

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) { }

  async create(input: UserInputRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) throw new BadRequestError('User with email already exists.');

    return this.userRepository.create(input);
  }

  async getById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  async getAll(fields: ExtractedFields<User>, search?: string, page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.getAll(fields, search, page, limit);

    if (total === 0) throw new NotFoundException();

    return {
      data: users,
      pagination: generatePagination(total, page, limit),
    };
  }

  async update(input: UserUpdateRequest) {
    try {
      const existingUser = await this.userRepository.findById(input.id);
      if (!existingUser) throw new BadRequestError('User not exists.');

      return this.userRepository.update(input.id, input);
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) throw new BadRequestError('User not exists.');

      return this.userRepository.delete(id);
    } catch (error) {
      throw error
    }
  }
}
