import { UserDao } from '../dao/users.dao';
import { UserMinimalDTO } from '../dto/users.dto';
import { User } from '../entities/user.entity';
import { inject, injectable } from 'tsyringe';
import { BadRequestError, NotFoundException } from '../common/errors';
import { generatePagination } from '../common/pagination';

@injectable()
export class UserService {
  constructor(@inject(UserDao) private userDao: UserDao) { }

  async create(payload: UserMinimalDTO): Promise<User> {
    try {
      const isExistUser = await this.userDao.getByEmail(payload.email);
      if (isExistUser) throw new BadRequestError('User with email already exist.');

      const user = await this.userDao.create(payload);
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getAll(fields: (keyof User)[], search?: string, page: number = 1, limit: number = 10) {
    try {
      const [items, total] = await this.userDao.getAll(fields, search, page, limit)

      if (total === 0) throw new NotFoundException();

      return {
        data: items,
        pagination: generatePagination(total, page, limit)
      }

    } catch (e) {
      throw e;
    }
  }
}
