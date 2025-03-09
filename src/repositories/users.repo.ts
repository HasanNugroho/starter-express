import { User } from '../entities/user.entity';
import { FindManyOptions, FindOptionsSelect, ILike, Repository } from 'typeorm';
import dataSourceConfig from '../db/data-source';
import { autoInjectable } from 'tsyringe';
import { buildSelectFields, ExtractedFields } from '../common/extractFields';
import { UserInputRequest, UserUpdateRequest } from '../models/users.models';
import { NotFoundException } from '../common/errors';

@autoInjectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSourceConfig.getRepository(User);
  }

  async create(input: UserInputRequest): Promise<User> {
    const user = this.repository.create(input);
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async getAll(fields: ExtractedFields<User>, search?: string, page: number = 1, limit: number = 10): Promise<[User[], number]> {
    const options: FindManyOptions<User> = {
      select: buildSelectFields(fields.fields),
      take: limit,
      skip: (page - 1) * limit,
      where: search
        ? [
          { email: ILike(`%${search}%`) },
          { name: ILike(`%${search}%`) },
        ]
        : undefined,
    };

    return this.repository.findAndCount(options);
  }

  async update(id: string, payload: UserUpdateRequest) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, payload);

    return await this.repository.save(user);
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}
