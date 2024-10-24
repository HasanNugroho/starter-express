import { User } from '../entities/user.entity';
import { FindManyOptions, FindOptionsSelect, ILike, Repository } from 'typeorm';
import dataSourceConfig from '../db/data-source';
import { autoInjectable } from 'tsyringe';
import { UserMinimalDTO } from '../dto/users.dto';
import { MapResult } from 'graphql-fields-list';

@autoInjectable()
export class UserDao {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSourceConfig.getRepository(User);
  }

  async create(payload: UserMinimalDTO): Promise<User> {
    const user = this.userRepository.create(payload);
    return await this.userRepository.save(user);
  }

  async getById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getAll(fields: (keyof User)[], search?: string, page: number = 1, limit: number = 10): Promise<[User[], number]> {
    console.log(fields)
    let options: FindManyOptions<User> = {
      select: fields.reduce((acc, field) => {
        acc[field] = true;  // Set each field to true
        return acc;
      }, {} as FindOptionsSelect<User>),
      take: limit,
      skip: (page - 1) * limit,
    };

    if (search) {
      options.where = [
        { email: ILike(`%${search}%`) },
        { name: ILike(`%${search}%`) },
      ];
    }

    return await this.userRepository.findAndCount(options);
  }
}
