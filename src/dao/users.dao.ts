import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import dataSourceConfig from '../db/data-source';
import { autoInjectable, injectAll } from 'tsyringe';

@autoInjectable()
export class UserDao {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSourceConfig.getRepository(User);
  }

  async create(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = this.userRepository.create(payload);
    return await this.userRepository.save(user);
  }

  async getById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
