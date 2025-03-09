import { User } from '../entities/user.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import dataSourceConfig from '../database/data-source';
import { autoInjectable } from 'tsyringe';
import { buildSelectFields, ExtractedFields } from '../utilities/extractFields';
import { UserInputRequest, UserUpdateRequest } from '../models/users.models';
import { NotFoundException } from '../utilities/errors';
import logger from '../configs/logger';

@autoInjectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSourceConfig.getRepository(User);
  }

  async create(input: UserInputRequest): Promise<User> {
    try {
      const user = this.repository.create(input);
      return await this.repository.save(user);
    } catch (error) {
      logger.error(`Error creating user: ${(error as Error).message}`, { error });
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      logger.error(`Error finding user by ID (${id}): ${(error as Error).message}`, { error });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      logger.error(`Error finding user by email (${email}): ${(error as Error).message}`, { error });
      throw error;
    }
  }

  async getAll(
    fields: ExtractedFields<User>,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<[User[], number]> {
    try {
      const options: FindManyOptions<User> = {
        select: buildSelectFields(fields.fields),
        take: limit,
        skip: (page - 1) * limit,
        where: search
          ? [{ email: ILike(`%${search}%`) }, { name: ILike(`%${search}%`) }]
          : undefined,
      };
      logger.info(`Fetching users with options: ${JSON.stringify(options)}`);
      return await this.repository.findAndCount(options);
    } catch (error) {
      logger.error(`Error getting all users: ${(error as Error).message}`, { error });
      throw error;
    }
  }

  async update(id: string, payload: UserUpdateRequest) {
    try {
      const user = await this.repository.findOne({ where: { id } });
      if (!user) {
        logger.warn(`User with ID ${id} not found for update`);
        throw new NotFoundException('User not found');
      }

      Object.assign(user, payload);
      return await this.repository.save(user);
    } catch (error) {
      logger.error(`Error updating user with ID ${id}: ${(error as Error).message}`, { error });
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const result = await this.repository.delete({ id });
      if (result.affected === 0) {
        logger.warn(`User with ID ${id} not found for deletion`);
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      logger.error(`Error deleting user with ID ${id}: ${(error as Error).message}`, { error });
      throw error;
    }
  }
}
