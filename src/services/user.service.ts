import { UserDao } from '../dao/users.dao';
import { UserMinimalDTO } from '../dto/users.dto';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { BadRequestError } from '../helper/errors';

@injectable()
export class UserService {
  constructor(@inject(UserDao) private userDao: UserDao) {}

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

  async refreshToken(user: User): Promise<{ user: User; token: string }> {
    return {
      token: jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        'secretkeyappearshere',
        { expiresIn: '1h' }
      ),
      user,
    };
  }
}
